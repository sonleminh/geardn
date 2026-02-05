import { ATTRIBUTE_ORDER } from "@/constants/attributeOrder";
import { IProduct } from "@/interfaces/IProduct";
import { IProductSku, IProductSkuAttributes } from "@/interfaces/IProductSku";
import { useState, useMemo } from "react";

export const useProductSkuSelection = (product: IProduct | undefined) => {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(
    product?.skus?.length === 1 &&
      product.skus[0].productSkuAttributes.length > 0
      ? {
          [product.skus[0].productSkuAttributes[0].attributeValue.attribute
            .name]:
            product.skus[0].productSkuAttributes[0].attributeValue.value,
        }
      : {}
  );

  const [count, setCount] = useState<number | null>(1);

  const attributeOptions = useMemo(() => {
    if (!product) return {};

    const options: Record<string, string[]> = {};
    product?.skus?.forEach((sku) => {
      sku?.productSkuAttributes?.forEach(
        (productSkuAttributes: IProductSkuAttributes) => {
          if (!options[productSkuAttributes?.attributeValue?.attribute?.name]) {
            options[productSkuAttributes?.attributeValue?.attribute?.name] = [];
          }
          if (
            !options[
              productSkuAttributes?.attributeValue?.attribute?.name
            ].includes(productSkuAttributes?.attributeValue?.value)
          ) {
            options[productSkuAttributes?.attributeValue?.attribute?.name].push(
              productSkuAttributes?.attributeValue?.value
            );
          }
        }
      );
    });

    const order =
      ATTRIBUTE_ORDER[product?.category?.name] ?? Object.keys(options);

    const sortedOptions: Record<string, string[]> = {};
    order.forEach((key) => {
      if (options[key]) {
        sortedOptions[key] = options[key];
      }
    });

    return sortedOptions;
  }, [product]);

  const skuVariations = useMemo(
    () =>
      product?.skus?.map((sku) => ({
        availableCombinations: sku.productSkuAttributes.reduce(
          (
            acc: Record<string, string>,
            productSkuAttributes: IProductSkuAttributes
          ) => {
            acc[productSkuAttributes.attributeValue.attribute.name] =
              productSkuAttributes.attributeValue.value;
            return acc;
          },
          {} as Record<string, string>
        ),
        availableStock: sku.stocks?.reduce(
          (acc: number, stock: { id: number; quantity: number }) =>
            acc + stock.quantity,
          0
        ),
      })),
    [product]
  );

  const selectedSku = useMemo<IProductSku | null>(() => {
    const hasNullValue = Object.values(selectedAttributes).some(
      (value) => value === null
    );

    if (
      hasNullValue ||
      Object.keys(selectedAttributes).length !==
        Object.keys(attributeOptions).length
    )
      return null;

    return (
      product?.skus?.find((sku) =>
        Object.entries(selectedAttributes).every(([key, value]) =>
          sku.productSkuAttributes.some(
            (productSkuAttributes: IProductSkuAttributes) =>
              productSkuAttributes.attributeValue.attribute.name === key &&
              productSkuAttributes.attributeValue.value === value
          )
        )
      ) ?? null
    );
  }, [selectedAttributes, attributeOptions, product?.skus]);

  const totalStock = product?.skus?.reduce(
    (acc, sku) =>
      acc +
      (sku.stocks?.reduce(
        (acc: number, stock: { id: number; quantity: number }) =>
          acc + stock.quantity,
        0
      ) || 0),
    0
  );

  const checkIsDisableAttributeValue = useMemo(() => {
    return (value: string) => {
      const isAvailabelAttributes = product?.skus?.some((sku) => {
        return (
          sku?.productSkuAttributes?.some((skuAttribute) => {
            return skuAttribute.attributeValue.value === value;
          }) && sku?.stocks?.some((stock) => stock.quantity > 0)
        );
      });
      return !isAvailabelAttributes;
    };
  }, [product]);

  const attributesStatusMap = useMemo(() => {
    const map: Record<string, boolean> = {};

    // Lặp qua tất cả các thuộc tính và giá trị có thể có
    Object.entries(attributeOptions).forEach(([type, values]) => {
      values.forEach((value) => {
        // Logic kiểm tra xem cặp (type, value) này có nên disable không

        let isDisabled = false;

        const isDisabledAttBtn = checkIsDisableAttributeValue(value);
        const isNotSelected = Object.keys(selectedAttributes).length === 0;
        const isValueExtistedInSelected = selectedAttributes[type] === value;

        if (
          isDisabledAttBtn &&
          isNotSelected &&
          isValueExtistedInSelected &&
          totalStock === 0
        ) {
          isDisabled = true;
        } else {
          // Copy logic giả lập selection
          const simulatedSelection = { ...selectedAttributes };
          const filteredSelection = Object.fromEntries(
            Object.entries(simulatedSelection).filter(([, val]) => val)
          );

          if (
            Object.hasOwn(filteredSelection, type) &&
            Object.keys(filteredSelection).length === 1
          ) {
            // do nothing -> isDisabled = false
          } else if (Object.keys(filteredSelection).length > 0) {
            if (filteredSelection[type] === value) {
              delete filteredSelection[type];
            } else {
              filteredSelection[type] = value;
            }

            const crrSku = skuVariations?.find((combo) =>
              Object.entries(filteredSelection).every(
                ([key, val]) => combo?.availableCombinations?.[key] === val
              )
            );

            if (crrSku?.availableStock === 0) isDisabled = true;
          }
        }

        map[`${type}-${value}`] = isDisabled;
      });
    });

    return map;
  }, [
    skuVariations,
    selectedAttributes,
    totalStock,
    attributeOptions,
    checkIsDisableAttributeValue,
  ]);

  const handleAttributeChange = (type: string, value: string) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev };

      if (newAttributes[type] === value) {
        delete newAttributes[type];
      } else {
        newAttributes[type] = value;
      }
      setCount(1);
      return newAttributes;
    });
  };

  return {
    selectedAttributes,
    selectedSku,
    count,
    setCount,
    attributeOptions,
    attributesStatusMap,
    handleAttributeChange,
    totalStock,
  };
};
