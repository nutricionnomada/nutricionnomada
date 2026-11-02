import Image from 'next/image';

// Recreación autorizada por la usuaria; el archivo original oficial sigue siendo distinto.
export default function Brand({ large = false }: { large?: boolean }) {
  return (
    <Image
      src="/brand/nutricion-nomada-recreado.png"
      alt="Nutrición Nómada — Vida en movimiento"
      width={2172}
      height={724}
      sizes={large ? '(max-width: 600px) 80vw, 400px' : '200px'}
      className={`brand-image${large ? ' brand-image-large' : ''}`}
      priority={!large}
    />
  );
}
