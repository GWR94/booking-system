export const SUPPORT_SECTIONS = ['faqs', 'terms', 'privacy', 'cookies'] as const;

export type SupportSection = (typeof SUPPORT_SECTIONS)[number];

export const DEFAULT_SUPPORT_SECTION: SupportSection = 'faqs';

export function parseSupportSection(
	value: string | null | undefined,
): SupportSection {
	if (value && SUPPORT_SECTIONS.includes(value as SupportSection)) {
		return value as SupportSection;
	}
	return DEFAULT_SUPPORT_SECTION;
}

/** Canonical href for footer links and redirects. */
export function supportSectionHref(section: SupportSection): string {
	if (section === DEFAULT_SUPPORT_SECTION) {
		return '/help';
	}
	return `/help?section=${section}`;
}

/** FAQ tab deep link, e.g. membership FAQs from the membership page. */
export function supportFaqsHref(category?: string): string {
	const params = new URLSearchParams();
	if (category) {
		params.set('category', category);
	}
	const qs = params.toString();
	return qs ? `/help?${qs}` : '/help';
}
