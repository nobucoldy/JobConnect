import React from 'react';
import Button from './components/common/Button';
import Badge from './components/common/Badge';
import Spinner from './components/common/Spinner';
import EmptyState from './components/common/EmptyState';
import Toast from './components/common/Toast';

const TestComponents = () => {
  return (
    <div style={{ padding: '40px', background: '#f5f5f5' }}>
      <h1>Test Components</h1>

      <div style={{ marginBottom: '30px', padding: '20px', background: 'white' }}>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', background: 'white' }}>
        <h2>Badges</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', background: 'white' }}>
        <h2>Spinner</h2>
        <Spinner size="md" />
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', background: 'white' }}>
        <h2>Empty State</h2>
        <EmptyState
          icon="📭"
          title="No Data"
          message="This is a test empty state"
        />
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', background: 'white' }}>
        <h2>Toast</h2>
        <Toast message="This is a success message" type="success" onClose={() => {}} />
        <Toast message="This is an error message" type="error" onClose={() => {}} />
      </div>
    </div>
  );
};

export default TestComponents;
