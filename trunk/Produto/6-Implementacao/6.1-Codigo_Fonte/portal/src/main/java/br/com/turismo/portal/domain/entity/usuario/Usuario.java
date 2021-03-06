package br.com.turismo.portal.domain.entity.usuario;

import java.io.Serializable;

import javax.persistence.Entity;

import org.directwebremoting.annotations.DataTransferObject;
import org.directwebremoting.annotations.Param;

import br.com.eits.common.domain.entity.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 */
@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@DataTransferObject(javascript = "Usuario")
public class Usuario extends AbstractEntity implements Serializable
{


	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	
	
	/*-------------------------------------------------------------------
	 *				 		     ATTRIBUTES
	 *-------------------------------------------------------------------*/

	private Long id;

	/*-------------------------------------------------------------------
	 * 		 					CONSTRUCTORS
	 *-------------------------------------------------------------------*/

	

	/*-------------------------------------------------------------------
	 *							BEHAVIORS
	 *-------------------------------------------------------------------*/

	
	
	/*-------------------------------------------------------------------
	 *						EXCEPTIONS
	 *-------------------------------------------------------------------*/


	
	/*-------------------------------------------------------------------
	 *						GETTERS AND SETTERS
	 *-------------------------------------------------------------------*/
	

}
