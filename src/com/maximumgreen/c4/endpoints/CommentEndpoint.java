package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.Comment;
import com.maximumgreen.c4.PMF;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
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
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "commentendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class CommentEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listComment")
	public CollectionResponse<Comment> listComment(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Comment> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Comment.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<Comment>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (Comment obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Comment> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getComment")
	public Comment getComment(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		Comment comment = null;
		try {
			comment = mgr.getObjectById(Comment.class, id);
		} finally {
			mgr.close();
		}
		return comment;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param comment the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertComment")
	public Comment insertComment(Comment comment) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (comment.getId() != null){
				if (containsComment(comment)) {
					throw new EntityExistsException("Object already exists");
				}
			}
			//set the date and date string to the date of creation (now)
			Date now = Calendar.getInstance().getTime();
			comment.setDate(now);
			comment.setDateString(formatDate(now));
			
			mgr.makePersistent(comment);
		} finally {
			mgr.close();
		}
		return comment;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param comment the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateComment")
	public Comment updateComment(Comment comment) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsComment(comment)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(comment);
		} finally {
			mgr.close();
		}
		return comment;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeComment")
	public void removeComment(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Comment comment = mgr.getObjectById(Comment.class, id);
			mgr.deletePersistent(comment);
		} finally {
			mgr.close();
		}
	}

	private boolean containsComment(Comment comment) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Comment.class, comment.getId());
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
		SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy hh:mm a");
		return formatter.format(date);
	}
}
