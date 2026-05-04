import {useState} from 'react';
import {Form, useRouteLoaderData, useFetcher} from 'react-router';
import {AppSession} from '~/lib/session';
import {MapPin, Plus, Check, X, Pencil, Trash2} from 'lucide-react';
import type {Route} from './+types/($locale).account.addresses';
import type {ShopifyAddress, Customer} from '~/lib/types';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

const CUSTOMER_ADDRESS_CREATE = `#graphql
  mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress { id }
      customerUserErrors { code field message }
    }
  }
`;

const CUSTOMER_ADDRESS_UPDATE = `#graphql
  mutation CustomerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress { id }
      customerUserErrors { code field message }
    }
  }
`;

const CUSTOMER_ADDRESS_DELETE = `#graphql
  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors { code field message }
    }
  }
`;

async function getAddresses(storefront: {query: Function}, token: string) {
  const data: {customer?: {defaultAddress?: ShopifyAddress; addresses?: {nodes: ShopifyAddress[]}}} = await storefront.query(`#graphql
    query CustomerAddresses($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        defaultAddress { id address1 address2 city province zip country phone }
        addresses(first: 10) {
          nodes { id address1 address2 city province zip country phone }
        }
      }
    }
  `, {variables: {customerAccessToken: token}});
  return {defaultAddress: data?.customer?.defaultAddress, addresses: data?.customer?.addresses?.nodes || []};
}

export async function action({request, context}: Route.ActionArgs) {
  const session = context.session as AppSession;
  const customerAccessToken = session.get('customerAccessToken');
  if (!customerAccessToken) return {errors: [{message: 'Non autenticato'}]};

  const formData = await request.formData();
  const _action = formData.get('_action') as string;
  const addressId = formData.get('addressId') as string;

  if (_action === 'delete' && addressId) {
    await context.storefront.mutate(CUSTOMER_ADDRESS_DELETE, {
      variables: {customerAccessToken, id: addressId},
    });
    return {success: true};
  }

  const address = {
    address1: formData.get('address1') as string,
    address2: formData.get('address2') as string || undefined,
    city: formData.get('city') as string,
    province: formData.get('province') as string,
    zip: formData.get('zip') as string,
    country: formData.get('country') as string || 'IT',
    phone: formData.get('phone') as string || undefined,
  };

  if (_action === 'update' && addressId) {
    const data: any = await context.storefront.mutate(CUSTOMER_ADDRESS_UPDATE, {
      variables: {customerAccessToken, id: addressId, address},
    });
    const errors = data?.customerAddressUpdate?.customerUserErrors || [];
    if (errors.length) return {errors};
  } else {
    const data: any = await context.storefront.mutate(CUSTOMER_ADDRESS_CREATE, {
      variables: {customerAccessToken, address},
    });
    const errors = data?.customerAddressCreate?.customerUserErrors || [];
    if (errors.length) return {errors};
  }

  return {success: true};
}

export default function AccountAddresses() {
  const data = useRouteLoaderData('routes/($locale).account') as {customer?: Customer} | undefined;
  const [addresses, setAddresses] = useState<ShopifyAddress[]>(data?.customer?.addresses?.nodes || []);
  const [defaultAddress, setDefaultAddress] = useState<ShopifyAddress | undefined>(data?.customer?.defaultAddress);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fetcher = useFetcher();
  const lang = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-[#2d4a13] flex items-center space-x-2">
          <MapPin size={20} className="text-[#78c13b]" />
          <span>{t('addresses.title', lang)}</span>
        </h2>
        <button onClick={() => setShowForm(true)} className="text-xs font-bold text-[#78c13b] uppercase tracking-widest hover:underline flex items-center space-x-1">
          <Plus size={14} />
          <span>{t('addresses.new', lang)}</span>
        </button>
      </div>

      {fetcher.data?.errors?.map((e: {message: string}, i: number) => (
        <p key={i} className="text-red-500 text-sm p-3 bg-red-50 rounded-xl">{e.message}</p>
      ))}

      {showForm && (
        <AddressForm fetcher={fetcher} action="create" onClose={() => setShowForm(false)} />
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-3xl">
          <MapPin size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 text-sm">{t('addresses.empty', lang)}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr: ShopifyAddress) => {
            const editing = editId === addr.id;
            return (
              <div key={addr.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                {editing ? (
                  <AddressForm fetcher={fetcher} action="update" address={addr} onClose={() => setEditId(null)} />
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[#2d4a13]">{addr.address1}</p>
                      {addr.address2 && <p className="text-sm text-gray-500">{addr.address2}</p>}
                      <p className="text-sm text-gray-500">{addr.zip ? `${addr.zip} ` : ''}{addr.city ? `${addr.city}, ` : ''}{addr.province || ''}</p>
                      <p className="text-sm text-gray-500">{addr.country}</p>
                      {addr.phone && <p className="text-sm text-gray-500">Tel: {addr.phone}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setEditId(addr.id)} className="p-2 text-gray-400 hover:text-[#78c13b] rounded-full hover:bg-gray-50"><Pencil size={16} /></button>
                      <fetcher.Form method="post">
                        <input type="hidden" name="_action" value="delete" />
                        <input type="hidden" name="addressId" value={addr.id} />
                        <button type="submit" className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"><Trash2 size={16} /></button>
                      </fetcher.Form>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddressForm({fetcher, action, address, onClose}: {
  fetcher: {Form: typeof Form; state: string; data?: {errors?: {message: string}[]}};
  action: 'create' | 'update';
  address?: ShopifyAddress;
  onClose: () => void;
}) {
  const lang = useLocale();

  return (
    <fetcher.Form method="post" className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4">
      <input type="hidden" name="_action" value={action} />
      {address?.id && <input type="hidden" name="addressId" value={address.id} />}
      <div>
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">{t('addresses.address', lang)}</label>
        <input type="text" name="address1" required defaultValue={address?.address1 || ''} className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">{t('addresses.city', lang)}</label>
          <input type="text" name="city" required defaultValue={address?.city || ''} className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors" />
        </div>
        <div>
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">{t('addresses.province', lang)}</label>
          <input type="text" name="province" defaultValue={address?.province || ''} className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">{t('addresses.zip', lang)}</label>
          <input type="text" name="zip" defaultValue={address?.zip || ''} className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors" />
        </div>
        <div>
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">{t('addresses.phone', lang)}</label>
          <input type="tel" name="phone" defaultValue={address?.phone || ''} className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors" />
        </div>
      </div>
      <div className="flex space-x-3">
        <button type="submit" className="bg-[#78c13b] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#68a632] transition-all flex items-center space-x-2">
          <Check size={16} /><span>{t('addresses.save', lang)}</span>
        </button>
        <button type="button" onClick={onClose} className="text-gray-500 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center space-x-2">
          <X size={16} /><span>{t('addresses.cancel', lang)}</span>
        </button>
      </div>
    </fetcher.Form>
  );
}
