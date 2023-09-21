
// Prefered: as a plugin (directive + filter) + custom placeholders support
import { app } from '@/main';
import VueMask from 'v-mask'
app.use(VueMask);

// Or as a directive-only
import { VueMaskDirective } from 'v-mask'
app.directive('mask', VueMaskDirective);

// Or only as a filter-only
import { VueMaskFilter } from 'v-mask'
app.filter('VMask', VueMaskFilter)