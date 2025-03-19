import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/types';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  onClick?: () => void;
  className?: string;
}

export default function TaskStatusBadge({ status, onClick, className = '' }: TaskStatusBadgeProps) {
  // Define styles based on status
  const getStatusStyle = () => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-100 text-gray-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  // Define text label based on status
  const getStatusLabel = () => {
    switch (status) {
      case TaskStatus.TODO:
        return 'Not Started';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.COMPLETED:
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <Badge 
      className={`${getStatusStyle()} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {getStatusLabel()}
    </Badge>
  );
} 