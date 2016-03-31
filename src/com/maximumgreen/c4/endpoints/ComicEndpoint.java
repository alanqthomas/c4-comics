package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.Comic;
import com.maximumgreen.c4.PMF;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "comicendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class ComicEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listComic")
	public CollectionResponse<Comic> listComic(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Comic> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Comic.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<Comic>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (Comic obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Comic> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getComic")
	public Comic getComic(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		Comic comic = null;
		try {
			comic = mgr.getObjectById(Comic.class, id);
		} finally {
			mgr.close();
		}
		return comic;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param comic the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertComic")
	public Comic insertComic(Comic comic) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (containsComic(comic)) {
				throw new EntityExistsException("Object already exists");
			}
			mgr.makePersistent(comic);
		} finally {
			mgr.close();
		}
		return comic;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param comic the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateComic")
	public Comic updateComic(Comic comic) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsComic(comic)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(comic);
		} finally {
			mgr.close();
		}
		return comic;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeComic")
	public void removeComic(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Comic comic = mgr.getObjectById(Comic.class, id);
			mgr.deletePersistent(comic);
		} finally {
			mgr.close();
		}
	}

	private boolean containsComic(Comic comic) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Comic.class, comic.getId());
		} catch (javax.jdo.JDOObjectNotFoundException ex) {
			contains = false;
		} finally {
			mgr.close();
		}
		return contains;
	}

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}
