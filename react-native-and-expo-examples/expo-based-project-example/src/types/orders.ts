export interface OrderDataInterface {
  order_number: number;
  items: Array<OrderItemInterface>;
}

export interface OrderItemInterface {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: Array<OrderTaxInterface>;
  meta_data: Array<OrderMetaInterface>;
}

export interface OrderTaxInterface {
  total: string;
  subtotal: string;
}

export interface OrderMetaInterface {
  id: number;
  key: string;
  value: string;
}
