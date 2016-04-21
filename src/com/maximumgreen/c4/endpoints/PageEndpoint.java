package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.Page;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "pageendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class PageEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listPage")
	public CollectionResponse<Page> listPage(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Page> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Page.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<Page>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (Page obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Page> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getPage")
	public Page getPage(@Named("id") Long id) throws BadRequestException, NotFoundException {
		if (id == null)
			throw new BadRequestException("Page ID must be specified");
		
		PersistenceManager mgr = getPersistenceManager();
		Page page = null;
		try {
			page = mgr.getObjectById(Page.class, id);
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Page ID doesn't exist");
		} finally {
			mgr.close();
		}
		return page;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param page the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertPage")
	public Page insertPage(Page page) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (page.getId() != null){
				if (containsPage(page)) {
					throw new EntityExistsException("Object already exists");
				}
			}
			//set the date and date string to the date of creation (now)
			Date now = Calendar.getInstance().getTime();
			page.setDateCreated(now);
			page.setDateString(formatDate(now));

			mgr.makePersistent(page);
		} finally {
			mgr.close();
		}
		return page;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param page the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updatePage")
	public Page updatePage(Page page) throws BadRequestException, NotFoundException{
		if (page.getId() == null)
			throw new BadRequestException("Page ID can not be null");
		PersistenceManager mgr = getPersistenceManager();
		Page updatedPage;
		try {
			//get the page to update from the datastore
			updatedPage = getPage(page.getId());
			//update the provided fields
			if (page.getImageURL() != null)
				updatedPage.setImageURL(page.getImageURL());
			if (page.getDateCreated() != null)
				updatedPage.setDateCreated(page.getDateCreated());
			
			mgr.makePersistent(updatedPage);
		} finally {
			mgr.close();
		}
		return updatedPage;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removePage")
	public void removePage(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Page page = mgr.getObjectById(Page.class, id);
			mgr.deletePersistent(page);
		} finally {
			mgr.close();
		}
	}

	private boolean containsPage(Page page) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Page.class, page.getId());
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

	private String formatDate(Date date){
		SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy");
		return formatter.format(date);
	}
	
}