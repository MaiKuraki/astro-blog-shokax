import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'
import themeConfig from './src/theme.config'

const iconSafeList = themeConfig.nav.flatMap((item) => {
  const icons: string[] = []
  if (item.icon) {
    icons.push(item.icon)
  }
  if (item.dropboxItems) {
    item.dropboxItems.forEach((subItem) => {
      if (subItem.icon) {
        icons.push(subItem.icon)
      }
    })
  }
  return icons
})

// Add sidebar social and menu icons to safelist
if (themeConfig.sidebar?.social) {
  Object.values(themeConfig.sidebar.social).forEach((value) => {
    const iconStr = typeof value === 'string' ? value.split('||')[1]?.trim() : value.icon
    if (iconStr) {
      const iconClass = iconStr.startsWith('i-') ? iconStr : `i-ri-${iconStr}`
      iconSafeList.push(iconClass)
    }
  })
}

if (themeConfig.sidebar?.menu) {
  Object.values(themeConfig.sidebar.menu).forEach((value) => {
    const iconStr = typeof value === 'string' ? value.split('||')[1]?.trim() : ''
    if (iconStr) {
      const iconClass = iconStr.startsWith('i-') ? iconStr : `i-ri-${iconStr}`
      iconSafeList.push(iconClass)
    }
  })
}

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    presetAttributify(),
  ],
  safelist: [...new Set([...iconSafeList])],
})
