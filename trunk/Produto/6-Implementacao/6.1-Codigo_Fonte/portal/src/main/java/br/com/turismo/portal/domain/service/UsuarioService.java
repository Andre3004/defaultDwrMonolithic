/**
 *
 */
package br.com.turismo.portal.domain.service;

import org.directwebremoting.annotations.RemoteProxy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.turismo.portal.domain.entity.usuario.Usuario;

/**
 * @author 
 */
@Service
@RemoteProxy
@Transactional
public class UsuarioService
{
	/*-------------------------------------------------------------------
	 *				 		     ATTRIBUTES
	 *-------------------------------------------------------------------*/

	
	/*-------------------------------------------------------------------
	 *				 		     SERVICES
	 *-------------------------------------------------------------------*/

	/**
	 * 
	 */
	public Usuario getMsg()
	{
		Usuario usuario = new Usuario();
		usuario.setId(1L);
		return usuario;
	}
	
	
}
