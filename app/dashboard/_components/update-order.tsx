import { Button } from "@/components/custom/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "sonner";

type UpdateProps = {
  open: boolean;
  onClose: () => void;
  id: string;
};

function UpdateOrder({ open, onClose, id }: UpdateProps) {
  const [tracker, setTracker] = React.useState<string>("");
  const [company, setCompany] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        setTracker(res.data[0].tracking_number);
        setCompany(res.data[0].shipping_company);
        setSelectedStatus(res.data[0].delivery_status);
      } catch (err) {
        console.error(err);
      }
    };
    getData()
  }, [id]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const formData = {
        tracking_number: tracker,
        shipping_company: company,
        delivery_status: selectedStatus,
      };

      const resp = await axios.put(`/api/orders/${id}`, formData);

      if (resp.status === 200) {
        toast.success("Order updated successfully");
        onClose();
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order</DialogTitle>
          <DialogDescription>
            Modify your tracking number and select a new shipping company if
            needed.
          </DialogDescription>
        </DialogHeader>

        <Input value={tracker} type="text" placeholder="Tracker number" onChange={(e) => setTracker(e.target.value)} />

        <div className={cn("flex", "mt-4")}>
          <Input value={company} type="text" placeholder="Shipping company" onChange={(e) => setCompany(e.target.value)} />
        </div>

        <div>
          <Select
            onValueChange={(e) => setSelectedStatus(e)}
            defaultValue={selectedStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Delivery Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="on the way">On the way</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button loading={isLoading} onClick={handleUpdate}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateOrder;
