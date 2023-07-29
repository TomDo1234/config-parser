import { buildConfig } from 'payload/config';
import { Posts } from './Posts';
import { samplePlugin } from './samplePlugin';
import { getMediaCollection } from './getMediaCollection';
import stripePlugin from '@payloadcms/plugin-stripe';

export default buildConfig({
  collections: [
    getMediaCollection('media'),
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'Pages Custom Column'
      },
      access: {
        read: () => true
      },
      hooks: {
        afterRead: [
          () => {
            console.log('read')
          }
        ]
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        }
      ]
    },
    Posts,
  ],
  plugins: [
    samplePlugin,
    stripePlugin({
      stripeSecretKey: '',
      isTestKey: Boolean(process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY),
      stripeWebhooksEndpointSecret: '',
    })
  ]
})
