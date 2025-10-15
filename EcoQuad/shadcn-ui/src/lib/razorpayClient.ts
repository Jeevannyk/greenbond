export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function createOrder(amount: number) {
  const backendUrl = (import.meta as any).env?.VITE_PAYMENT_BACKEND_URL || 'http://localhost:5000';
  const resp = await fetch(`${backendUrl}/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency: 'INR' })
  });
  const body = await resp.text();
  let json;
  try {
    json = JSON.parse(body || '{}');
  } catch (e) {
    throw new Error(`Failed to create order: invalid JSON response (${resp.status})`);
  }
  if (!resp.ok) {
    const message = json?.message || json?.error || `Failed to create order (status ${resp.status})`;
    throw new Error(message);
  }
  return json;
}

export async function openCheckout(order: any, key: string, onSuccess: (data: any) => void, onFailure?: (err: any) => void) {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Razorpay script failed to load');

  const options = {
    key,
    amount: order.amount,
    currency: order.currency,
    name: 'GreenBonds Platform',
    description: 'Bond Investment',
    order_id: order.id,
    handler: function (response: any) {
      onSuccess(response);
    },
    modal: {
      escape: true,
    },
    theme: {
      color: '#16a34a'
    }
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
  rzp.on('payment.failed', function (response: any) {
    if (onFailure) onFailure(response);
  });
}
