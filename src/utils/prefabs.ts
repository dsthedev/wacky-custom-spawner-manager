import creaturesPieces from '@/assets/creatures-pieces.json';

export function getCreatures(): string[] {
  return creaturesPieces.Creatures;
}

export function getPieces(): string[] {
  return creaturesPieces.Pieces;
}
