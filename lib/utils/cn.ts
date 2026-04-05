/**
 * Utilitaire pour combiner des classes Tailwind conditionnellement
 * Similaire à clsx mais ultra-léger
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
