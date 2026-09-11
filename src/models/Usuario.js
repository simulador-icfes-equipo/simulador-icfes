class Usuario {

    constructor(id_usuario, nombre, correo, password, fecha_registro, id_rol) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
        this.fecha_registro = fecha_registro;
        this.id_rol = id_rol;
    }

}

module.exports = Usuario;