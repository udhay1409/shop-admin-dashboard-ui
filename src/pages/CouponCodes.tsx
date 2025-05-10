
import React, { useState, useEffect } from "react";
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
import { Tag, Pencil, Trash2, Search, Plus, Loader2 } from "lucide-react";
import CouponDialog from "@/components/coupons/CouponDialog";
import DeleteCouponDialog from "@/components/coupons/DeleteCouponDialog";
import { useCoupons } from "@/hooks/useCoupons";
import CouponStats from "@/components/coupons/CouponStats";

const CouponCodes = () => {
  const { coupons, loading, createCoupon, updateCoupon, deleteCoupon } = useCoupons();
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

  const handleSaveCoupon = async (couponData: Coupon) => {
    try {
      if (couponData.id) {
        // Update existing coupon
        await updateCoupon(couponData.id, couponData);
      } else {
        // Add new coupon
        await createCoupon(couponData);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    await deleteCoupon(id);
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

      <CouponStats />

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-pink-500 mr-2" />
                    <span className="text-muted-foreground">Loading coupons...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCoupons.length > 0 ? (
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
