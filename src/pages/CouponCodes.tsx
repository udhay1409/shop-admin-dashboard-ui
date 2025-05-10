
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Coupon } from "@/types/coupon";
import { format } from "date-fns";
import { Tag, Pencil, Trash2, Search, Plus } from "lucide-react";
import CouponDialog from "@/components/coupons/CouponDialog";
import DeleteCouponDialog from "@/components/coupons/DeleteCouponDialog";

// Sample data - in a real app, this would come from an API
const sampleCoupons: Coupon[] = [
  {
    id: "1",
    code: "SUMMER25",
    type: "percentage",
    value: 25,
    minPurchase: 100,
    maxDiscount: 50,
    applicableProducts: "all",
    applicableCategories: "all",
    startDate: "2025-06-01T00:00:00Z",
    endDate: "2025-08-31T23:59:59Z",
    usageLimit: 1000,
    usageCount: 456,
    perCustomer: 1,
    status: "active",
    description: "Summer sale discount",
    createdAt: "2025-05-01T10:00:00Z",
    updatedAt: "2025-05-01T10:00:00Z",
  },
  {
    id: "2",
    code: "FREESHIP",
    type: "free_shipping",
    value: 0,
    minPurchase: 50,
    applicableProducts: "all",
    applicableCategories: "all",
    startDate: "2025-05-01T00:00:00Z",
    endDate: "2025-06-15T23:59:59Z",
    usageLimit: 500,
    usageCount: 123,
    perCustomer: 1,
    status: "active",
    description: "Free shipping on orders over $50",
    createdAt: "2025-04-15T14:00:00Z",
    updatedAt: "2025-04-15T14:00:00Z",
  },
  {
    id: "3",
    code: "WELCOME15",
    type: "percentage",
    value: 15,
    applicableProducts: "all",
    applicableCategories: "all",
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    usageCount: 987,
    status: "active",
    description: "Welcome discount for new customers",
    createdAt: "2025-01-01T09:00:00Z",
    updatedAt: "2025-01-01T09:00:00Z",
  },
  {
    id: "4",
    code: "FLASH50",
    type: "percentage",
    value: 50,
    minPurchase: 200,
    maxDiscount: 100,
    applicableProducts: "specific",
    productIds: ["101", "102", "103"],
    applicableCategories: "all",
    startDate: "2025-05-20T00:00:00Z",
    endDate: "2025-05-22T23:59:59Z",
    usageLimit: 200,
    usageCount: 157,
    perCustomer: 1,
    status: "expired",
    description: "Flash sale - 50% off premium products",
    createdAt: "2025-05-15T11:30:00Z",
    updatedAt: "2025-05-22T23:59:59Z",
  },
  {
    id: "5",
    code: "HOLIDAY20",
    type: "percentage",
    value: 20,
    applicableProducts: "all",
    applicableCategories: "specific",
    categoryIds: ["clothing", "accessories"],
    startDate: "2025-12-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    usageCount: 0,
    status: "scheduled",
    description: "Holiday season discount",
    createdAt: "2025-11-10T16:45:00Z",
    updatedAt: "2025-11-10T16:45:00Z",
  },
];

const CouponCodes = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(sampleCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (coupon?: Coupon) => {
    setSelectedCoupon(coupon || null);
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveCoupon = (couponData: Coupon) => {
    if (couponData.id) {
      // Update existing coupon
      setCoupons(coupons.map(c => c.id === couponData.id ? couponData : c));
    } else {
      // Add new coupon
      const newCoupon = {
        ...couponData,
        id: Math.random().toString(36).substring(2, 9),
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCoupons([...coupons, newCoupon]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    setIsDeleteDialogOpen(false);
  };

  const renderCouponValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case "percentage":
        return `${coupon.value}%`;
      case "fixed":
        return `$${coupon.value}`;
      case "free_shipping":
        return "Free Shipping";
      case "buy_x_get_y":
        return `Buy X Get ${coupon.value}`;
      default:
        return coupon.value;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "expired":
        return <Badge variant="secondary">Expired</Badge>;
      case "scheduled":
        return <Badge variant="warning">Scheduled</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Coupon Codes</h1>
          <p className="text-muted-foreground">
            Manage discount coupons and promotional offers
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={16} />
          Add Coupon
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Tag size={16} className="text-pink-500" />
                    {coupon.code}
                  </TableCell>
                  <TableCell className="capitalize">{coupon.type.replace("_", " ")}</TableCell>
                  <TableCell>{renderCouponValue(coupon)}</TableCell>
                  <TableCell>{format(new Date(coupon.startDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(coupon.endDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(coupon)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDeleteDialog(coupon)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No coupons found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CouponDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        coupon={selectedCoupon}
        onSave={handleSaveCoupon}
      />

      <DeleteCouponDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        couponId={selectedCoupon?.id || ""}
        couponCode={selectedCoupon?.code || ""}
        onDelete={handleDeleteCoupon}
      />
    </div>
  );
};

export default CouponCodes;
