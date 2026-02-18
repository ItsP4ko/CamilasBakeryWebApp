import jsPDF from "jspdf";
export const generarPDFPedido = (pedido) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 20;
    // Título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`Detalle del Pedido ID: #${pedido.idPedido}`, 14, yPos);
    yPos += 12;
    // Información del cliente
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Cliente:", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(pedido.nombreCliente, 40, yPos);
    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(pedido.fecha.split("T")[0].split("-").reverse().join("/"), 40, yPos);
    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Metodos de pago disponibles:", 14, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.text("• ALIAS: CamilasBakery", 18, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.text("• Efectivo", 18, yPos);
    yPos += 10;
    // Detalles de productos
    pedido.detallePedidos?.forEach((detalle, idx) => {
        // Verificar si necesitamos nueva página
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        // Rectángulo para cada producto
        doc.setDrawColor(200);
        doc.setFillColor(245, 245, 245);
        const rectHeight = 25 +
            (detalle.extras?.length || 0) * 5 +
            (detalle.ingredientesExtras?.length || 0) * 5;
        doc.rect(14, yPos, pageWidth - 28, rectHeight, "FD");
        yPos += 7;
        // Nombre del producto
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(`${detalle.nombreTorta}, ${detalle.tamanoMedida}`, 18, yPos);
        yPos += 7;
        // Cantidad y precio
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Cantidad: ${detalle.cantidad}`, 18, yPos);
        const precio = `$ ${detalle.totalProducto?.toLocaleString("es-AR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
        const precioWidth = doc.getTextWidth(precio);
        doc.setFont("helvetica", "bold");
        doc.text(precio, pageWidth - 18 - precioWidth, yPos);
        yPos += 7;
        // Extras
        if (detalle.extras && detalle.extras.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text("Extras:", 18, yPos);
            yPos += 5;
            doc.setFont("helvetica", "normal");
            detalle.extras.forEach((e) => {
                const textoExtra = `• ${e.nombreCostoExtra} × ${e.cantidad}${e.nota ? ` "${e.nota}"` : ""}`;
                doc.text(textoExtra, 22, yPos);
                yPos += 5;
            });
        }
        // Ingredientes extras
        if (detalle.ingredientesExtras && detalle.ingredientesExtras.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text("Ingredientes extras:", 18, yPos);
            yPos += 5;
            doc.setFont("helvetica", "normal");
            detalle.ingredientesExtras.forEach((e) => {
                const textoIng = `• ${e.nombreIngrediente} × ${e.cantidad}${e.nota ? ` "${e.nota}"` : ""}`;
                doc.text(textoIng, 22, yPos);
                yPos += 5;
            });
        }
        yPos += 5;
    });
    // Total al final
    yPos += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total:", 14, yPos);
    doc.setFontSize(14);
    const totalTexto = `$ ${pedido.total?.toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
    const totalWidth = doc.getTextWidth(totalTexto);
    doc.text(totalTexto, pageWidth - 18 - totalWidth, yPos);
    // Guardar el PDF
    doc.save(`Pedido_${pedido.idPedido}_${pedido.nombreCliente}.pdf`);
};
