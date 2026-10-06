const statusMap = {
  booked: { label: 'Booked', bg: 'bg-light-blue-bg', text: 'text-blue', dot: 'bg-blue' },
  picked_up: { label: 'Picked Up', bg: 'bg-light-orange', text: 'text-orange', dot: 'bg-orange' },
  in_transit: { label: 'In Transit', bg: 'bg-light-blue-bg', text: 'text-bright-blue', dot: 'bg-bright-blue' },
  out_for_delivery: { label: 'Out for Delivery', bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500' },
  delivered: { label: 'Delivered', bg: 'bg-green-50', text: 'text-success', dot: 'bg-success' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-error', dot: 'bg-error' },
  exception: { label: 'Exception', bg: 'bg-red-50', text: 'text-error', dot: 'bg-error' },
  active: { label: 'Active', bg: 'bg-green-50', text: 'text-success', dot: 'bg-success' },
  inactive: { label: 'Inactive', bg: 'bg-light-orange', text: 'text-orange', dot: 'bg-orange' },
  under_review: { label: 'Under Review', bg: 'bg-light-blue-bg', text: 'text-blue', dot: 'bg-blue' },
  scheduled: { label: 'Scheduled', bg: 'bg-light-orange', text: 'text-orange', dot: 'bg-orange' },
};

export default function StatusBadge({ status }) {
  const s = statusMap[status] || statusMap.booked;
  return (
    <span className={`badge ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export const STATUS_OPTIONS = Object.keys(statusMap);
