import { supportSectionHref } from '@features/help-center/supportSections';
import { redirect } from 'next/navigation';

export default function PrivacyPage() {
	redirect(supportSectionHref('privacy'));
}
