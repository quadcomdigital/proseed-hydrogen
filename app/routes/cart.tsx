import {CartForm} from '@shopify/hydrogen';
import type {Route} from './+types/cart';
import {CartMain} from '~/components/CartMain';

export async function loader({context}: Route.LoaderArgs) {
  const cart = await context.cart.get();
  return {cart};
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  let result: any;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await context.cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await context.cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await context.cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
      result = await context.cart.updateDiscountCodes(inputs.discountCodes);
      break;
    case CartForm.ACTIONS.GiftCardCodesUpdate:
      result = await context.cart.updateGiftCardCodes(inputs.giftCardCodes);
      break;
    case CartForm.ACTIONS.GiftCardCodesRemove:
      result = await context.cart.removeGiftCardCodes(inputs.giftCardCodes);
      break;
    case CartForm.ACTIONS.NoteUpdate:
      result = await context.cart.updateNote(inputs.note);
      break;
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await context.cart.updateBuyerIdentity(inputs.buyerIdentity);
      break;
    case CartForm.ACTIONS.Create:
      result = await context.cart.create(inputs.input);
      break;
    default:
      return Response.json({ok: false, message: 'Unsupported cart action'}, {status: 400});
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? context.cart.setCartId(cartId) : new Headers();
  return Response.json(result, {headers});
}

export default function CartPage({loaderData}: Route.ComponentProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:py-14">
      <h1 className="mb-6 text-2xl lg:text-5xl font-black text-emerald-900">Carrello</h1>
      <CartMain cart={loaderData.cart} layout="page" />
    </div>
  );
}
