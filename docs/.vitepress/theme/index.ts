import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'

import CodeCard from './components/CodeCard.vue'
import directive from './directives'
import './styles/index.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('CodeCard', CodeCard)
    directive(app)
  }
}
