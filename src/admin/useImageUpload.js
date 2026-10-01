import { supabase, UPLOADS_BUCKET } from '../lib/supabase.js'

// Largeur maximale après redimensionnement : évite de reproduire le problème
// identifié lors de l'audit de performance de ce site (ex. le logo MSFS
// pesait 60 Ko affiché à seulement 40px de haut) — peu importe la taille du
// fichier choisi par l'admin dans son explorateur de fichiers, on ne stocke
// jamais plus large que nécessaire pour un affichage en ~2x (écrans retina).
const MAX_WIDTH = 800
const QUALITY = 0.85

// Redimensionne et réencode l'image en WebP directement dans le navigateur
// (Canvas API, aucune dépendance) avant l'upload, puis renvoie les
// dimensions RÉELLES du fichier final — ce sont elles qui serviront
// d'attributs width/height dans le HTML public, pour éviter les décalages
// de mise en page (CLS) comme on l'a corrigé plus tôt sur ce site.
export async function uploadImage(file, destPath) {
  if (!supabase) throw new Error('Supabase non configuré')

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_WIDTH / bitmap.width)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', QUALITY))

  // upsert: true écrase un éventuel fichier existant au même chemin (utile
  // pour l'image d'événement, toujours stockée sous le même nom) plutôt que
  // d'échouer si le fichier existe déjà.
  const { error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .upload(destPath, blob, { upsert: true, contentType: 'image/webp' })

  if (error) throw error

  return { path: destPath, width, height }
}
