import type { StatusPageSummary } from '../types';
import { timeAgo } from '../lib/format';

interface IncidentsProps {
  statusPage: StatusPageSummary | undefined;
  isLoading?: boolean;
}

export function Incidents({ statusPage, isLoading }: IncidentsProps) {
  if (isLoading) {
    return (
      <div className="card col-span-12">
        <div className="card-header">
          <div className="card-title">Status & Incidents</div>
        </div>
        <div className="skeleton skeleton-text" style={{ marginBottom: 12 }} />
        <div className="skeleton skeleton-text" style={{ marginBottom: 12 }} />
      </div>
    );
  }

  const hasIncidents = statusPage?.incidents && statusPage.incidents.length > 0;
  const hasMaintenances = statusPage?.scheduled_maintenances && statusPage.scheduled_maintenances.length > 0;

  if (!hasIncidents && !hasMaintenances) {
    return (
      <div className="card col-span-12">
        <div className="card-header">
          <div className="card-title">Status & Incidents</div>
          <a 
            href="https://status.stellar.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="api-link"
          >
            StatusPage
          </a>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '16px 0',
          color: 'var(--color-success)'
        }}>
          <span className="status-indicator success" />
          <span>All Systems Operational</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card col-span-12">
      <div className="card-header">
        <div className="card-title">Status & Incidents</div>
        <a 
          href="https://status.stellar.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-link"
        >
          StatusPage
        </a>
      </div>

      {statusPage?.incidents.map((incident) => (
        <div 
          key={incident.id} 
          className={`incident-item ${incident.status === 'resolved' ? 'resolved' : ''}`}
        >
          <div className="incident-title">
            <a href={incident.shortlink} target="_blank" rel="noopener noreferrer">
              {incident.name}
            </a>
          </div>
          <div className="incident-status">
            Status: <strong>{incident.status}</strong> • Impact: {incident.impact}
          </div>
          {incident.incident_updates.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {incident.incident_updates[0].body}
            </div>
          )}
          <div className="incident-time">
            Created {timeAgo(incident.created_at)}
            {incident.resolved_at && ` • Resolved ${timeAgo(incident.resolved_at)}`}
          </div>
        </div>
      ))}

      {statusPage?.scheduled_maintenances.map((maintenance) => (
        <div key={maintenance.id} className="incident-item">
          <div className="incident-title">
            <a href={maintenance.shortlink} target="_blank" rel="noopener noreferrer">
              🔧 {maintenance.name}
            </a>
          </div>
          <div className="incident-status">
            Scheduled: {new Date(maintenance.scheduled_for).toLocaleString()} - {new Date(maintenance.scheduled_until).toLocaleString()}
          </div>
          {maintenance.incident_updates.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {maintenance.incident_updates[0].body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
