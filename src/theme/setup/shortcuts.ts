import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { defineShortcutsSetup } from '@slidev/types'

// Home / End jump to the first / last slide (Page Up / Page Down are built in)
export default defineShortcutsSetup((nav: NavOperations, base: ShortcutOptions[]) => [
  ...base,
  { name: 'go_first', key: 'home', fn: () => nav.goFirst() },
  { name: 'go_last', key: 'end', fn: () => nav.goLast() },
])
