
import { Menu } from './menu.model';

// Lista de Roles
// Admin
// Administrador
// Secretario
// Encargado de Bodega
// Encargado de Repartidores
// Motorizado
function setMenu(): Menu[] {
    let usuario = JSON.parse(localStorage.getItem('Identity'));
    // while (!usuario || !usuario.Role) {
    //     setTimeout(() => {
    //         usuario = JSON.parse(localStorage.getItem('Identity'));
    //     }, 3200);
    // }
    let role = undefined;
    if (usuario && usuario.Role) {
        role = usuario.Role;
    }
    let Menus = [
        new Menu (101, 'Inicio', '/', null, 'home', null, false, 0                ),
        new Menu (11, 'Mi Información', '/profile/user-info', null, 'address-card-o', null, false, 0                ),
        // new Menu (90, 'Ingresos', null, null, 'briefcase', null, true, 0                                            ),
        // new Menu (92, 'Lista de Ingresos', '/lista-ingresos', null, 'list', null, false, 90                         ),
        // new Menu (100, 'Traslados', null, null, 'briefcase', null, true, 0                                          ),
        // new Menu (102, 'Lista de Traslados', '/lista-transacciones', null, 'list', null, false, 100                 ),
    ];
    if (role == 'Admin' || role == 'Administrador' || role == 'Secretario') {
        Menus.push(new Menu (20,    'Personas', '/personas', null, 'users', null, false, 0                            ));
        Menus.push(new Menu (30,    'Locaciones', '/locaciones', null, 'map-signs', null, false, 0                    ));
        Menus.push(new Menu (40,    'Productos', '/productos', null, 'shopping-cart', null, false, 0                  ));
        Menus.push(new Menu (50,    'Categorias', '/categorias', null, 'tags', null, false, 0                         ));
    }
    if (role == 'Admin' || role == 'Administrador') {
        Menus.push(new Menu (60,    'Usuarios', '/usuarios', null, 'id-badge', null, false, 0));
    }
    if (role == 'Admin' || role == 'Administrador') {
        Menus.push(new Menu (70,    'Empresas', '/empresas', null, 'building', null, false, 0                         ));
    }
    if (role == 'Encargado de Repartidores') {
        Menus.push(new Menu (70,    'Mi Empresa', '/my-empresa', null, 'building', null, false, 0                         ));
    }
    if (role == 'Admin' || role == 'Administrador' || role == 'Secretario') {
        Menus.push(new Menu (80,    'Bodegas', '/bodegas', null, 'industry', null, false, 0                           ));
    }
    if (role == 'Encargado de Bodega') {
        Menus.push(new Menu (80,    'Mi Bodega', '/my-bodega', null, 'industry', null, false, 0                           ));

    }
    if (role != 'Motorizado') {
        Menus.push(new Menu (90,    'Ingresos', null, null, 'briefcase', null, true, 0                                ));
        Menus.push(new Menu (100,   'Traslados', null, null, 'briefcase', null, true, 0                               ));
        if (role == 'Admin' || role == 'Secretario' || role == 'Encargado de Bodega') {
            Menus.push(new Menu (91,    'Solicitud de Ingreso', '/crear-ingresos', null, 'plus', null, false, 90          ));
            if(role == 'Admin' || role == 'Secretario' ) {
                Menus.push(new Menu (101,   'Solicitud de Traslado', '/crear-transacciones', null, 'plus', null, false, 100   ));
            }
        }
        Menus.push(new Menu (92,    'Lista de Ingresos', '/lista-ingresos', null, 'list', null, false, 90             ));
        Menus.push(new Menu (102,   'Lista de Traslados', '/lista-transacciones', null, 'list', null, false, 100      ));
    }
    if (role == 'Admin' || role == 'Secretario') {
        Menus.push(new Menu (121,   'Solicitud de Pedidos', '/crear-pedidos', null, 'plus', null, false, 120          ));
    }
    if (role != 'Encargado de Bodega') {
        Menus.push(new Menu (120,   'Pedidos', null, null, 'briefcase', null, true, 0                                 ));
        Menus.push(new Menu (122,   'Lista de Pedidos', '/lista-pedidos', null, 'list', null, false, 120              ));
    }
    
    if (role == 'Admin' || role == 'Administrador' || role == 'Secretario' || role == 'Encargado de Bodega') {
        Menus.push(new Menu (110,   'Inventario', '/stocks', null, 'archive', null, false, 0                          ));
    }
    return Menus;
}


export const verticalMenuItems = setMenu();



export const horizontalMenuItems = setMenu();

// import { Menu } from './menu.model';

// export const verticalMenuItems = [ 
//     // new Menu (10, 'Perfil', null, null, 'user', null, true, 0),
//     new Menu (11, 'Mi Información', '/profile/user-info', null, 'address-card-o', null, false, 0),
//     new Menu (20, 'Personas', '/personas', null, 'users', null, false, 0),
//     new Menu (30, 'Locaciones', '/locaciones', null, 'map-signs', null, false, 0),
//     new Menu (40, 'Productos', '/productos', null, 'shopping-cart', null, false, 0),
//     new Menu (50, 'Categorias', '/categorias', null, 'tags', null, false, 0),
//     new Menu (60, 'Usuarios', '/usuarios', null, 'id-badge', null, false, 0),
//     new Menu (70, 'Empresas', '/empresas', null, 'building', null, false, 0),
//     new Menu (80, 'Bodegas', '/bodegas', null, 'industry', null, false, 0),
//     new Menu (90, 'Ingresos', null, null, 'briefcase', null, true, 0),
//     new Menu (91, 'Solicitud de Ingreso', '/crear-ingresos', null, 'plus', null, false, 90),
//     new Menu (92, 'Lista de Ingresos', '/lista-ingresos', null, 'list', null, false, 90),
//     new Menu (100, 'Traslados', null, null, 'briefcase', null, true, 0),
//     new Menu (101, 'Solicitud de Traslado', '/crear-transacciones', null, 'plus', null, false, 100),
//     new Menu (102, 'Lista de Traslados', '/lista-transacciones', null, 'list', null, false, 100),
//     new Menu (120, 'Pedidos', null, null, 'briefcase', null, true, 0),
//     new Menu (121, 'Solicitud de Pedidos', '/crear-pedidos', null, 'plus', null, false, 120),
//     new Menu (122, 'Lista de Pedidos', '/lista-pedidos', null, 'list', null, false, 120),
//     new Menu (110, 'Inventario', '/stocks', null, 'archive', null, false, 0),
// ]

// export const horizontalMenuItems = [ 
//     // new Menu (10, 'Perfil', null, null, 'user', null, true, 0),
//     new Menu (11, 'Mi Información', '/profile/user-info', null, 'address-card-o', null, false, 0),
//     new Menu (20, 'Personas', '/personas', null, 'users', null, false, 0),
//     new Menu (30, 'Locaciones', '/locaciones', null, 'map-signs', null, false, 0),
//     new Menu (40, 'Productos', '/productos', null, 'shopping-cart', null, false, 0),
//     new Menu (50, 'Categorias', '/categorias', null, 'tags', null, false, 0),
//     new Menu (60, 'Usuarios', '/usuarios', null, 'id-badge', null, false, 0),
//     new Menu (70, 'Empresas', '/empresas', null, 'building', null, false, 0),
//     new Menu (80, 'Bodegas', '/bodegas', null, 'industry', null, false, 0),
//     new Menu (90, 'Ingresos', null, null, 'briefcase', null, true, 0),
//     new Menu (91, 'Solicitud de Ingreso', '/crear-ingresos', null, 'plus', null, false, 90),
//     new Menu (92, 'Lista Ingresos', '/lista-ingresos', null, 'list', null, false, 90),
//     new Menu (100, 'Traslados', null, null, 'briefcase', null, true, 0),
//     new Menu (101, 'Solicitud de Traslado', '/crear-transacciones', null, 'plus', null, false, 100),
//     new Menu (102, 'Lista Traslados', '/lista-transacciones', null, 'list', null, false, 100),
//     new Menu (120, 'Pedidos', null, null, 'briefcase', null, true, 0),
//     new Menu (121, 'Solicitud de Pedidos', '/crear-pedidos', null, 'plus', null, false, 120),
//     new Menu (122, 'Lista de Pedidos', '/lista-pedidos', null, 'list', null, false, 120),
//     new Menu (110, 'Inventario', '/stocks', null, 'archive', null, false, 0),
// ]