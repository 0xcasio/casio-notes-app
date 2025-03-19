import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function TasksPageSkeleton() {
  // Create array of 5 items for skeleton
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Filter skeletons */}
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {skeletonItems.map((item) => (
          <Card key={item} className="overflow-hidden animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 