import { permanentRedirect } from 'next/navigation';
// Existing external links continue to resolve; new content has one canonical URL.
export default function PreviousEnglishArticle() {
  permanentRedirect('/en/guide/turkiye-mermer-cesitleri');
}
