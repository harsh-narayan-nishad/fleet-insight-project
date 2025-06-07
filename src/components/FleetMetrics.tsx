
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FleetMetrics = () => {
  const metrics = [
    {
      title: "Total Fleet Size",
      value: "847",
      change: "+12",
      changeType: "positive",
      description: "Active vehicles"
    },
    {
      title: "Annual Spend",
      value: "$2.4M",
      change: "-8.2%",
      changeType: "positive",
      description: "This fiscal year"
    },
    {
      title: "Average Age",
      value: "6.2 years",
      change: "+0.3",
      changeType: "neutral",
      description: "Fleet average"
    },
    {
      title: "EV Percentage",
      value: "14.2%",
      change: "+2.1%",
      changeType: "positive",
      description: "Electric vehicles"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                <p className="text-sm text-slate-600">{metric.title}</p>
              </div>
              <Badge 
                variant={metric.changeType === "positive" ? "default" : "secondary"}
                className={
                  metric.changeType === "positive" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-slate-100 text-slate-600"
                }
              >
                {metric.change}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-2">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FleetMetrics;
