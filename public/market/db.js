/* The publishable Supabase client is shared with Auth. Database policies decide access. */
(() => {
  const client = () => {
    if (!window.MarbleAuth?.client) throw new Error("Supabase connection is unavailable");
    return window.MarbleAuth.client;
  };
  const checked = ({ data, error }) => {
    if (error) throw error;
    return data;
  };
  const api = {
    client,
    async account(user) {
      const sb = client();
      const [profile, application, admin] = await Promise.all([
        sb.from("mb_profiles").select("*").eq("user_id", user.id).single(),
        sb.from("mb_company_applications").select("*").eq("owner_id", user.id).maybeSingle(),
        sb.rpc("mb_is_admin")
      ]);
      const data = {
        profile: checked(profile),
        application: checked(application),
        admin: checked(admin),
        verification: null,
        membership: null,
        activeSupplier: false
      };
      if (data.application) {
        const [verification, membership] = await Promise.all([
          sb.from("mb_company_verifications").select("*").eq("application_id", data.application.id).maybeSingle(),
          sb.from("mb_company_memberships").select("*").eq("application_id", data.application.id).order("ends_at", { ascending: false }).limit(1).maybeSingle()
        ]);
        data.verification = checked(verification);
        data.membership = checked(membership);
        const now = Date.now();
        data.activeSupplier = data.profile.account_role === "supplier" && data.verification?.verified === true &&
          data.membership && Date.parse(data.membership.started_at) <= now && Date.parse(data.membership.ends_at) > now;
      }
      return data;
    },
    async requests() {
      const sb = client();
      const requests = checked(await sb.from("mb_purchase_requests").select("*").order("created_at", { ascending: false }).limit(100));
      if (!requests.length) return [];
      const offers = checked(await sb.from("mb_offers").select("*").in("request_id", requests.map(r => r.id)));
      return requests.map(r => ({ ...r, offers: offers.filter(o => o.request_id === r.id) }));
    },
    async directory() {
      const rows = checked(await client().rpc("mb_list_directory_companies"));
      return (rows || []).filter(row => ["machines", "services"].includes(row.section) &&
        typeof row.name === "string" && row.name.trim()).map(row => ({
          name: row.name.trim(),
          city: String(row.city || "").trim(),
          activity_type: String(row.activity_type || ""),
          section: row.section
        }));
    },
    async createRequest(values) {
      return checked(await client().from("mb_purchase_requests").insert(values).select("id").single());
    },
    async createOffer(values) {
      return checked(await client().from("mb_offers").insert(values).select("id").single());
    },
    async acceptOffer(id) {
      return checked(await client().rpc("mb_accept_offer", { p_offer_id: id }));
    },
    async adminApplications() {
      const sb = client();
      const [apps, profiles, verifications, payments, memberships, events] = await Promise.all([
        sb.from("mb_company_applications").select("*").order("submitted_at", { ascending: false }),
        sb.from("mb_profiles").select("user_id,full_name"),
        sb.from("mb_company_verifications").select("*"),
        sb.from("mb_payment_confirmations").select("*").order("confirmed_at", { ascending: false }),
        sb.from("mb_company_memberships").select("*").order("started_at", { ascending: false }),
        sb.from("mb_review_events").select("*").order("occurred_at", { ascending: false }).limit(500)
      ]);
      return { apps: checked(apps), profiles: checked(profiles), verifications: checked(verifications),
        payments: checked(payments), memberships: checked(memberships), events: checked(events) };
    },
    async verificationDocument(ownerId) {
      const storage = client().storage.from("mb-company-documents-private");
      const files = checked(await storage.list(`${ownerId}/company-document`, { limit: 20 }));
      const file = files.find(f => f.name && !f.name.startsWith("."));
      if (!file) return null;
      return checked(await storage.createSignedUrl(`${ownerId}/company-document/${file.name}`, 120)).signedUrl;
    },
    async verify(applicationId, verified) {
      return checked(await client().rpc("mb_set_company_verification", { p_application_id: applicationId, p_verified: verified }));
    },
    async confirmPayment(applicationId, amount, reference, receivedAt) {
      return checked(await client().rpc("mb_confirm_bank_payment", {
        p_application_id: applicationId, p_amount_try: amount, p_bank_reference: reference, p_bank_received_at: receivedAt
      }));
    },
    async activate(applicationId, paymentId) {
      return checked(await client().rpc("mb_activate_membership", { p_application_id: applicationId, p_payment_id: paymentId }));
    }
  };
  window.MarbleDB = api;
  window.MarbleDBState = { status: "signed_out", userId: null, account: null, requests: [], error: null };
  window.MarbleDirectoryState = { status: "loading", companies: [] };
  let sequence = 0;
  let expirationTimer;
  let lastLoaded = 0;
  const notify = () => window.dispatchEvent(new Event("marble-db"));
  async function refreshDirectory() {
    try {
      const companies = await api.directory();
      window.MarbleDirectoryState = { status: "ready", companies };
    } catch (error) {
      console.error("Company directory unavailable", error);
      window.MarbleDirectoryState = { status: "error", companies: [] };
    }
    notify();
  }
  api.refreshDirectory = refreshDirectory;
  if (document.getElementById("categoryCompanies")) void refreshDirectory();
  async function refresh(user = window.MarbleAuthUser) {
    const ticket = ++sequence;
    clearTimeout(expirationTimer);
    if (!user) {
      window.MarbleDBState = { status: "signed_out", userId: null, account: null, requests: [], error: null };
      notify();
      return;
    }
    window.MarbleDBState = { status: "loading", userId: user.id, account: null, requests: [], error: null };
    notify();
    try {
      const account = await api.account(user);
      const requests = account.profile.account_role === "buyer" || account.activeSupplier ? await api.requests() : [];
      if (ticket !== sequence || window.MarbleAuthUser?.id !== user.id) return;
      window.MarbleDBState = { status: "ready", userId: user.id, account, requests, error: null };
      lastLoaded = Date.now();
      if (account.membership && Date.parse(account.membership.ends_at) > Date.now()) {
        expirationTimer = setTimeout(() => void refresh(window.MarbleAuthUser),
          Math.min(Date.parse(account.membership.ends_at) - Date.now() + 1000, 2147483647));
      }
    } catch (error) {
      if (ticket !== sequence || window.MarbleAuthUser?.id !== user.id) return;
      window.MarbleDBState = { status: "error", userId: user.id, account: null, requests: [], error: error.message || String(error) };
    }
    notify();
  }
  api.refresh = refresh;
  if (document.getElementById("workspaceContent")) {
    window.addEventListener("marble-auth", event => void refresh(event.detail.user));
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && window.MarbleAuthUser && Date.now() - lastLoaded > 30000) void refresh(window.MarbleAuthUser);
    });
    if (window.MarbleAuthUser) void refresh(window.MarbleAuthUser);
  }
})();
