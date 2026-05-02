import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Trash2, Plus, Minus} from 'lucide-react';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({layout, line}: {layout: CartLayout; line: CartLine}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id}>
      <div className="flex space-x-4 bg-gray-50 p-3 rounded-xl mb-3">
        {image && (
          <Link to={lineItemUrl} className="w-20 h-20 bg-white rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-100">
            <Image alt={title} data={image} className="h-full w-full object-cover" loading="lazy" />
          </Link>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <Link to={lineItemUrl} className="font-bold text-gray-900 text-sm line-clamp-2 pr-2">
                {product.title}
              </Link>
              <CartLineRemoveButton lineIds={[id]}>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </CartLineRemoveButton>
            </div>
            <p className="text-[#78c13b] font-black text-sm mt-1">
              {line?.cost?.totalAmount?.amount
                ? `${Number(line.cost.totalAmount.amount).toFixed(2)} ${line.cost.totalAmount.currencyCode || 'EUR'}`
                : ''}
            </p>
            {selectedOptions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedOptions.filter(o => o.value !== 'Default Title').map((option) => (
                  <span key={option.name} className="text-[10px] text-gray-400 font-medium">{option.name}: {option.value}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <CartLineQuantity line={line} />
          </div>
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center bg-white rounded-lg border border-gray-200 h-8">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button disabled={quantity <= 1 || !!isOptimistic} className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-30">
          <Minus size={14} />
        </button>
      </CartLineUpdateButton>
      <span className="w-8 text-center text-sm font-bold text-gray-900">{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button disabled={!!isOptimistic} className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-30">
          <Plus size={14} />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({lineIds, children}: {lineIds: string[]; children: React.ReactNode}) {
  return (
    <CartForm fetcherKey={getUpdateKey(lineIds)} route="/cart" action={CartForm.ACTIONS.LinesRemove} inputs={{lineIds}}>
      {children}
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}: {children: React.ReactNode; lines: CartLineUpdateInput[]}) {
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm fetcherKey={getUpdateKey(lineIds)} route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{lines}}>
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
