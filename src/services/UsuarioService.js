const bcrypt = require("bcryptjs");

class UsuarioService {

    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async obtenerTodos() {
        return await this.usuarioRepository.obtenerTodos();
    }
    
    async login(correo, password) {
    if (!correo || correo.trim() === "") {
        throw new Error("El correo es obligatorio");
    }

    if (!password || password.trim() === "") {
        throw new Error("La contraseña es obligatoria");
    }

    const usuario = await this.usuarioRepository.obtenerPorCorreo(
        correo.trim()
    );

    if (!usuario) {
        throw new Error("Correo o contraseña incorrectos");
    }

    const passwordCorrecta = await bcrypt.compare(
        password,
        usuario.password
    );

    if (!passwordCorrecta) {
        throw new Error("Correo o contraseña incorrectos");
    }

    const { password: _, ...usuarioSinPassword } = usuario;

    return usuarioSinPassword;
}

    async obtenerPorId(id_usuario) {
        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("El ID del usuario no es válido");
        }

        return await this.usuarioRepository.obtenerPorId(id_usuario);
    }

    async crear(usuario) {
        const { nombre, correo, password, id_rol } = usuario;

        if (!nombre || nombre.trim() === "") {
            throw new Error("El nombre es obligatorio");
        }

        if (!correo || correo.trim() === "") {
            throw new Error("El correo es obligatorio");
        }

        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
        if (!correoValido) {
            throw new Error("El correo no tiene un formato válido");
        }

        if (!password || password.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        const existente = await this.usuarioRepository.obtenerPorCorreo(correo);
        if (existente) {
            throw new Error("Ya existe un usuario registrado con ese correo");
        }

       const passwordEncriptada = await bcrypt.hash(password, 10);

      return await this.usuarioRepository.crear({
      nombre: nombre.trim(),
      correo: correo.trim(),
      password: passwordEncriptada,
      id_rol: id_rol || 2
    });
    }

    async actualizar(id_usuario, usuario) {
        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("El ID del usuario no es válido");
        }

        const usuarioExistente = await this.usuarioRepository.obtenerPorId(id_usuario);
        if (!usuarioExistente) {
            return null;
        }

        const { nombre, correo, id_rol } = usuario;

        if (!nombre || nombre.trim() === "") {
            throw new Error("El nombre es obligatorio");
        }

        if (!correo || correo.trim() === "") {
            throw new Error("El correo es obligatorio");
        }

        return await this.usuarioRepository.actualizar(id_usuario, {
            nombre: nombre.trim(),
            correo: correo.trim(),
            id_rol: id_rol || usuarioExistente.id_rol
        });
    }

    async eliminar(id_usuario) {
        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("El ID del usuario no es válido");
        }

        const usuarioExistente = await this.usuarioRepository.obtenerPorId(id_usuario);
        if (!usuarioExistente) {
            return false;
        }

        return await this.usuarioRepository.eliminar(id_usuario);
    }

}

module.exports = UsuarioService;
