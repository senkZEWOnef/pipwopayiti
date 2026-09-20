import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ShippingHero,
  ShippingServices,
  ShippingSteps,
  ShippingActions,
  ShippingCTA,
} from "../components/ShippingSections";

export default function ShippingPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("shipping.pageTitle");
  }, [t]);

  return (
    <div>
      <ShippingHero showLogo={false} />
      <ShippingActions />
      <ShippingServices />
      <ShippingSteps />
      <ShippingCTA />
    </div>
  );
}
