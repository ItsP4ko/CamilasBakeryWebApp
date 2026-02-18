// src/types/pedidos.ts
// Enums para estados y métodos de pago
export var EstadoPedido;
(function (EstadoPedido) {
    EstadoPedido["PENDIENTE"] = "Pendiente";
    EstadoPedido["EN_PROCESO"] = "En Proceso";
    EstadoPedido["COMPLETADO"] = "Completado";
    EstadoPedido["CANCELADO"] = "Cancelado";
    EstadoPedido["ENTREGADO"] = "Entregado";
})(EstadoPedido || (EstadoPedido = {}));
export var MetodoPago;
(function (MetodoPago) {
    MetodoPago["EFECTIVO"] = "Efectivo";
    MetodoPago["TRANSFERENCIA"] = "Transferencia";
    MetodoPago["TARJETA"] = "Tarjeta";
    MetodoPago["MERCADO_PAGO"] = "Mercado Pago";
})(MetodoPago || (MetodoPago = {}));
