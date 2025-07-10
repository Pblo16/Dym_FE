import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface FilterProps {
    sortOrder: string;
    setSortOrder: (value: string) => void;
    title?: string; // Optional title prop for future use
}

export function Filter({ sortOrder, setSortOrder, title }: FilterProps) {
    return (
        <>
            <div className="hidden md:block mb-4">
                {title && <h3 className="mb-2 font-semibold text-lg">{title}</h3>}
                <RadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="createdAt:desc" id="recent-desktop" />
                        <Label htmlFor="recent-desktop">Agregados Recientemente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="price:asc" id="price-high-desktop" />
                        <Label htmlFor="price-high-desktop">Precio Menor a Mayor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="price:desc" id="price-low-desktop" />
                        <Label htmlFor="price-low-desktop">Precio Mayor a Menor</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="md:hidden flex items-center gap-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="w-6 h-6" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-4">
                        {title && <h3 className="font-semibold text-lg">{title}</h3>}
                        <RadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="createdAt:desc" id="recent-mobile" />
                                <Label htmlFor="recent-mobile">Agregados Recientemente</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="price:asc" id="price-high-mobile" />
                                <Label htmlFor="price-high-mobile">Precio Mayor a menor</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="price:desc" id="price-low-mobile" />
                                <Label htmlFor="price-low-mobile">Precio Menor a Mayor</Label>
                            </div>
                        </RadioGroup>
                    </SheetContent>
                </Sheet>
            </div>
        </>

    );
}