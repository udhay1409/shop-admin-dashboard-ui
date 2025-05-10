
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const generateDashboardReport = async () => {
  try {
    // Fetch orders data
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    
    if (ordersError) throw ordersError;
    
    // Fetch products data
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("units_sold", { ascending: false })
      .limit(20);
    
    if (productsError) throw productsError;
    
    // Fetch users data
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("*")
      .limit(50);
    
    if (usersError) throw usersError;
    
    // Create CSV content for orders
    const ordersCSV = convertToCSV(orders);
    const productsCSV = convertToCSV(products);
    const usersCSV = convertToCSV(users);
    
    // Download files
    downloadCSV(ordersCSV, "orders-report.csv");
    downloadCSV(productsCSV, "products-report.csv");
    downloadCSV(usersCSV, "users-report.csv");
    
    toast({
      title: "Report Generated Successfully",
      description: "The reports have been downloaded to your device",
    });
    
    return true;
  } catch (error) {
    console.error("Error generating report:", error);
    toast({
      title: "Failed to Generate Report",
      description: "An error occurred while generating your report",
      variant: "destructive",
    });
    return false;
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data: any[]) => {
  if (!data || !data.length) return "";
  
  const header = Object.keys(data[0]).join(",");
  const rows = data.map(item => 
    Object.values(item)
      .map(value => {
        // Handle strings with commas by wrapping in quotes
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`;
        }
        return value;
      })
      .join(",")
  );
  
  return [header, ...rows].join("\n");
};

// Helper function to download CSV file
const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
