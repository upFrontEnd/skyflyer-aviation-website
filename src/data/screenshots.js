const modules = import.meta.glob('../screenshots/*.jpg', {
  eager: true,
  import: 'default'
})

export const screenshots = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src], index) => ({
    id: index + 1,
    src,
    alt: `Capture d'écran simulation de vol ${index + 1}`
  }))
