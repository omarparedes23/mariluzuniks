import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/actions/products'
import { Plus, Pencil, Package } from 'lucide-react'
import { DeleteProductButton } from './components/DeleteProductButton'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Productos</h1>
          <p className="text-muted">Gestiona el inventario de productos</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-gold text-black px-4 py-2 rounded font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left p-4 text-cream font-medium">Imagen</th>
                <th className="text-left p-4 text-cream font-medium">Nombre</th>
                <th className="text-left p-4 text-cream font-medium">Stock</th>
                <th className="text-left p-4 text-cream font-medium">Precio</th>
                <th className="text-right p-4 text-cream font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gold/10 last:border-b-0">
                  <td className="p-4">
                    {product.imagen_url_r2 ? (
                      <Image
                        src={product.imagen_url_r2}
                        alt={product.nombre}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-[60px] h-[60px] bg-bg rounded flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-cream">{product.nombre}</td>
                  <td className="p-4">
                    <span className={`${product.stock < 5 ? 'text-red-400' : 'text-cream'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-cream">S/ {Number(product.precio).toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="p-2 text-gold hover:bg-gold/10 rounded transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-gold/20 rounded-lg p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-cream mb-2">No hay productos registrados</p>
          <p className="text-muted text-sm mb-4">Comienza agregando tu primer producto</p>
          <Link
            href="/admin/productos/nuevo"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Agregar producto →
          </Link>
        </div>
      )}
    </div>
  )
}
