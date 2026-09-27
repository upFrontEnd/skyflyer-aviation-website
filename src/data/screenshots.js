const modules = import.meta.glob('../screenshots/*.jpg', {
  eager: true,
  import: 'default'
})

const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b))

export const screenshots = entries.map(([path, src], index) => ({
  id: index + 1,
  src,
  alt: `Capture d'écran simulation de vol ${index + 1}`
}))

export const headerScreenshots = entries
  .filter(([path]) => path.includes('_head'))
  .map(([, src]) => src)
