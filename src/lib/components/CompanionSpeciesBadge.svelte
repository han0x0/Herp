<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { t, getLocale } from '$lib/i18n';

	type Species = 'dog' | 'cat' | 'mouse' | 'reptile';

	interface Props {
		species: Species | null | undefined;
		size?: 'sm' | 'md';
	}

	let { species, size = 'md' }: Props = $props();
	const locale = getLocale();

	import type { MessageKey } from '$lib/i18n';

	const SPECIES_META: Record<Species, { emoji: string; variant: 'primary' | 'teal' | 'gold' | 'secondary'; labelKey: MessageKey }> = {
		dog:     { emoji: '🐕', variant: 'primary',  labelKey: 'enum.species.dog' },
		cat:     { emoji: '🐈', variant: 'gold',     labelKey: 'enum.species.cat' },
		mouse:   { emoji: '🐭', variant: 'secondary', labelKey: 'enum.species.mouse' },
		reptile: { emoji: '🦎', variant: 'teal',     labelKey: 'enum.species.reptile' }
	};

	let meta = $derived(species ? SPECIES_META[species] : null);
</script>

{#if meta}
	<Badge
		variant={meta.variant}
		class={size === 'sm' ? 'text-[10px] py-0 px-1.5' : 'text-xs'}
		title={t(locale, meta.labelKey)}
	>
		<span aria-hidden="true" class={size === 'sm' ? 'mr-0.5 text-xs' : 'mr-1'}>{meta.emoji}</span>
		<span>{t(locale, meta.labelKey)}</span>
	</Badge>
{/if}
