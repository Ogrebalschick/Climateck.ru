<?php
class ModelExtensionTotalShipping extends Model {
    public function getTotal($total) {
        if ($this->cart->hasShipping() && isset($this->session->data['shipping_method'])) {

            $shipping_method = $this->session->data['shipping_method'];

            // Безопасные значения с дефолтами
            $title = isset($shipping_method['title']) ? $shipping_method['title'] : '';
            $cost = isset($shipping_method['cost']) ? $shipping_method['cost'] : 0;
            $tax_class_id = isset($shipping_method['tax_class_id']) ? $shipping_method['tax_class_id'] : 0;

            $total['totals'][] = array(
                'code'       => 'shipping',
                'title'      => $title,
                'value'      => $cost,
                'sort_order' => $this->config->get('total_shipping_sort_order')
            );

            if ($tax_class_id) {
                $tax_rates = $this->tax->getRates($cost, $tax_class_id);

                foreach ($tax_rates as $tax_rate) {
                    if (!isset($total['taxes'][$tax_rate['tax_rate_id']])) {
                        $total['taxes'][$tax_rate['tax_rate_id']] = $tax_rate['amount'];
                    } else {
                        $total['taxes'][$tax_rate['tax_rate_id']] += $tax_rate['amount'];
                    }
                }
            }

            $total['total'] += $cost;
        }
    }
}
