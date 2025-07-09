import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface FilterProps {
    sortOrder: string;
    setSortOrder: (value: string) => void;
    title?: string; // Optional title prop for future use
}

export function Filter({ sortOrder, setSortOrder, title }: FilterProps) {
    return (
        <>
            <div className="hidden md:block mb-4">
                {title && <h3 className="mb-2 font-semibold text-lg">{title}</h3>}z
                <RadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="createdAt:desc" id="recent-desktop" />
                        <Label htmlFor="recent-desktop">Agregados Recientemente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="price:asc" id="price-high-desktop" />
                        <Label htmlFor="price-high-desktop">Precio Mayor a menor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="price:desc" id="price-low-desktop" />
                        <Label htmlFor="price-low-desktop">Precio Menor a Mayor</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="md:hidden flex items-center gap-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MenuIcon className="w-6 h-6" />
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

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}