"use client";

import { Create, SimpleForm, TextInput, SelectInput, BooleanInput } from 'react-admin';

const SettingsCreate = () => (
  <Create title="Create New Settings">
    <SimpleForm>
      {/* General Settings */}
      <TextInput source="siteTitle" label="Site Title" fullWidth />
      <TextInput source="logoUrl" label="Logo URL" fullWidth />
      <SelectInput
        source="language"
        label="Language"
        choices={[
          { id: 'en', name: 'English' },
          { id: 'fr', name: 'French' },
          { id: 'es', name: 'Spanish' },
          { id: 'it', name: 'Italian' }
        ]}
      />
      <SelectInput
        source="timezone"
        label="Timezone"
        choices={[
          { id: 'UTC', name: 'UTC' },
          { id: 'PST', name: 'Pacific Time' },
          { id: 'EST', name: 'Eastern Time' }
        ]}
      />

      {/* Security Settings */}
      <BooleanInput source="enable2FA" label="Enable Two-Factor Authentication" />

      {/* SEO Settings */}
      <TextInput source="metaTitle" label="Meta Title" fullWidth />
      <TextInput source="metaDescription" label="Meta Description" fullWidth />

      {/* Payment Settings */}
      <TextInput source="paymentGateway" label="Payment Gateway (Stripe, PayPal...)" fullWidth />

      {/* Email Settings */}
      <TextInput source="smtpServer" label="SMTP Server" fullWidth />
      <TextInput source="smtpEmail" label="SMTP Email" fullWidth />
      <TextInput source="smtpPassword" label="SMTP Password" fullWidth type="password" />
    </SimpleForm>
  </Create>
);

export default SettingsCreate;