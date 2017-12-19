/**
 *
 */
package br.com.turismo.portal.domain.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.turismo.portal.domain.entity.usuario.Usuario;

/**
 * @author Gabriel Putrick
 */
public interface IUsuarioRepository extends JpaRepository<Usuario, Long>
{
	
}
