import { getConfig } from 'lib/config'
import { NextApiRequest, NextApiResponse } from 'next'

import { CartResponse, RestResponse } from 'lib/bigcommerce'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = getConfig()

  if (req.method === 'GET') {
    if (req.query.cartId == null) {
      return res
        .status(400)
        .json({ message: "Failed to fetch cart. 'cartId' query param required." })
    }

    const response = await fetch(
      `https://api.bigcommerce.com/stores/${config.bigcommerce.storeHash}/v3/carts/${req.query.cartId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.accessToken,
        },
      },
    )

    if (!response.ok) throw new Error(response.statusText)

    const result: RestResponse<CartResponse> = await response.json()

    return res.status(200).json(result)
  }

  if (req.method === 'POST') {
    if (req.query.cartId == null) {
      const response = await fetch(
        `https://api.bigcommerce.com/stores/${config.bigcommerce.storeHash}/v3/carts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': config.bigcommerce.accessToken,
          },
          body: JSON.stringify({
            line_items: [JSON.parse(req.body).line_item],
            channel_id: 1,
          }),
        },
      )

      if (!response.ok) throw new Error(response.statusText)

      const result: RestResponse<CartResponse> = await response.json()

      return res.status(200).json(result)
    }

    const response = await fetch(
      `https://api.bigcommerce.com/stores/${config.bigcommerce.storeHash}/v3/carts/${req.query.cartId}/items`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.accessToken,
        },
        body: JSON.stringify({
          line_items: [JSON.parse(req.body).line_item],
          channel_id: 1,
        }),
      },
    )

    if (!response.ok) throw new Error(response.statusText)

    const result: RestResponse<CartResponse> = await response.json()

    return res.status(200).json(result)
  }

  if (req.method === 'PUT') {
    if (req.query.cartId == null) {
      return res
        .status(400)
        .json({ message: "Failed to update lineItem. 'cartId' query param required." })
    }

    if (req.query.lineItemId == null) {
      return res
        .status(400)
        .json({ message: "Failed to update lineItem. 'lineItemId' query param required." })
    }

    const response = await fetch(
      `https://api.bigcommerce.com/stores/${config.bigcommerce.storeHash}/v3/carts/${req.query.cartId}/items/${req.query.lineItemId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.accessToken,
        },
        body: req.body,
      },
    )

    if (!response.ok) throw new Error(response.statusText)

    const result: RestResponse<CartResponse> = await response.json()

    return res.status(200).json(result)
  }

  if (req.method === 'DELETE') {
    if (req.query.cartId == null) {
      return res
        .status(400)
        .json({ message: "Failed to delete lineItem. 'cartId' query param required." })
    }

    if (req.query.lineItemId == null) {
      return res
        .status(400)
        .json({ message: "Failed to delete lineItem. 'lineItemId' query param required." })
    }

    const response = await fetch(
      `https://api.bigcommerce.com/stores/${config.bigcommerce.storeHash}/v3/carts/${req.query.cartId}/items/${req.query.lineItemId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.accessToken,
        },
      },
    )

    if (!response.ok) throw new Error(response.statusText)

    if (response.status === 204) return res.status(204).json({})

    const result: RestResponse<CartResponse | null> = await response.json()

    return res.status(200).json(result)
  }

  return res.status(405).send('Method Not Allowed')
}
