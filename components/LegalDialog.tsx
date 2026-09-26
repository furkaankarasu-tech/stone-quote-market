"use client";

import { useEffect, useRef, useState } from "react";
import { legalDocuments, legalLinks, legalVersion } from "@/lib/legalDocuments";

type LegalKey = keyof typeof legalDocuments;

export default function LegalDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState<LegalKey>("kvkk");

  useEffect(() => {
    function openFromLink(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[data-legal]");
      const key = link?.dataset.legal as LegalKey | undefined;
      if (!link || !key || !(key in legalDocuments)) return;
      event.preventDefault();
      lastTrigger.current = link;
      setActive(key);
      if (!dialog.current?.open) dialog.current?.showModal();
    }
    document.addEventListener("click", openFromLink);
    return () => document.removeEventListener("click", openFromLink);
  }, []);

  function selectTab(key: LegalKey) {
    setActive(key);
    dialog.current?.querySelector(".legal-dialog-content")?.scrollTo(0, 0);
  }

  const documentText = legalDocuments[active];
  return (
    <dialog
      id="legalDialog"
      ref={dialog}
      className="legal-dialog"
      aria-labelledby="legalDialogTitle"
      onClose={() => lastTrigger.current?.focus()}
      onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}
    >
      <div className="legal-dialog-head">
        <div><span className="eyebrow dark">MARBLE BORSA · HUKUKİ METİNLER</span><h2 id="legalDialogTitle">{documentText.title}</h2></div>
        <button type="button" className="icon-button" aria-label="Kapat" onClick={() => dialog.current?.close()}>×</button>
      </div>
      <div className="legal-dialog-tabs" role="tablist" aria-label="Hukuki metinler">
        {legalLinks.map((link) => {
          const key = link.href.split("/").at(-1) as LegalKey;
          return <button type="button" key={key} role="tab" id={`legal-tab-${key}`} aria-controls="legal-dialog-panel" aria-selected={key === active} tabIndex={key === active ? 0 : -1} onClick={() => selectTab(key)} onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            const keys = legalLinks.map((item) => item.href.split("/").at(-1) as LegalKey);
            const next = keys[(keys.indexOf(key) + (event.key === "ArrowRight" ? 1 : keys.length - 1)) % keys.length];
            selectTab(next);
            document.getElementById(`legal-tab-${next}`)?.focus();
          }}>{link.label}</button>;
        })}
      </div>
      <div className="legal-dialog-content" id="legal-dialog-panel" role="tabpanel" aria-labelledby={`legal-tab-${active}`} tabIndex={0}>
        <p className="legal-dialog-date">Son güncelleme: {legalVersion}</p>
        {documentText.intro && <p>{documentText.intro}</p>}
        {documentText.sections.map((section) => <section key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>)}
      </div>
    </dialog>
  );
}
