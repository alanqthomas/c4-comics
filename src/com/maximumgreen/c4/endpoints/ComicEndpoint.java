package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.C4Rating;
import com.maximumgreen.c4.C4User;
import com.maximumgreen.c4.Comic;
import com.maximumgreen.c4.Comment;
import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.Page;
import com.maximumgreen.c4.Series;
import com.maximumgreen.c4.Tag;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.maximumgreen.c4.endpoints.IndexService;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Logger;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;

import org.mortbay.log.Log;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "comicendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class ComicEndpoint {

	private final static Logger log = Logger.getLogger(IndexService.class.getName());
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
	public Comic getComic(@Named("id") Long id) throws BadRequestException, NotFoundException {
		if (id == null)
			throw new BadRequestException("Comic ID must be specified");
		
		PersistenceManager mgr = getPersistenceManager();
		Comic comic = null;
		try {
			comic = mgr.getObjectById(Comic.class, id);
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic ID doesn't exist");
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
	 * @throws NotFoundException 
	 */
	@ApiMethod(name = "insertComic")
	public Comic insertComic(Comic comic) throws BadRequestException, NotFoundException {
		
		if(comic.getTitle() == null){
			comic.setTitle("New Comics");
		}
		if (comic.getSeriesId() == null || comic.getAuthorId() == null) {
			throw new BadRequestException("seriesId field missing");
		}
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (comic.getId() != null){
				if (containsComic(comic)) {
					throw new EntityExistsException("Object already exists");
				}
			}
			//set the date and date string to the date of creation (now)
			Date now = Calendar.getInstance().getTime();
			comic.setDateCreated(now);
			comic.setDateString(formatDate(now));
			
			mgr.makePersistent(comic);			
			index(comic);
			
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
	public Comic updateComic(Comic comic) throws BadRequestException, NotFoundException {
		if (comic.getId() == null)
			throw new BadRequestException("Comic ID can not be null");
		PersistenceManager mgr = getPersistenceManager();
		Comic updatedComic;
		try {
			//get the comic to update from the datastore
			updatedComic = getComic(comic.getId());
			//update the provided fields
			if (comic.getAuthorId() != null)
				updatedComic.setAuthorId(comic.getAuthorId());
			if (comic.getSeriesId() != null)
				updatedComic.setSeriesId(comic.getSeriesId());
			if (comic.getTitle() != null)
				updatedComic.setTitle(comic.getTitle());
			if (comic.getDateCreated() != null)
				updatedComic.setDateCreated(comic.getDateCreated());
			
			mgr.makePersistent(updatedComic);
			index(updatedComic);
		} catch (NotFoundException ex) {
			throw ex;
		} finally {
			mgr.close();
		}
		return updatedComic;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 * @throws NotFoundException 
	 */
	@ApiMethod(name = "removeComic")
	public void removeComic(@Named("id") Long id) throws NotFoundException {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Comic comic = mgr.getObjectById(Comic.class, id);
			mgr.deletePersistent(comic);
			IndexService.removeDocument(IndexService.COMIC, id.toString());
			index(comic);
		} finally {
			mgr.close();
		}
	}
	
	//CUSTOM METHODS
	@ApiMethod(name = "updateViewCount")
	public Comic updateViewCount(@Named("id") Long id) throws BadRequestException, NotFoundException {
		PersistenceManager mgr = getPersistenceManager();
		Comic comic;
		try {
			//get the comic to update from the datastore
			comic = getComic(id);		
			comic.updateViewCount();
			mgr.makePersistent(comic);
			index(comic);
		} catch (NotFoundException ex) {
			throw ex;
		} finally {
			mgr.close();
		}
		return comic;
	}
	
	@ApiMethod(name = "addRating")
	public Comic addRating(@Named("userId") String userId, @Named("comicId") Long comicId, 
			@Named("rating") double rating) throws BadRequestException, NotFoundException {
		
		if (rating < 0 || rating > 5)
			throw new BadRequestException("Invalid rating amount)");
		
		PersistenceManager mgr = getPersistenceManager();
		Comic comic;
		C4Rating ratingObj;
		
		try {
			comic = getComic(comicId);	
			
			//if the comic has no ratings, make the rating object
			if (!comic.isRated()) {
				ratingObj = new C4Rating(userId, comicId, rating);
				comic.setRated(true);
				mgr.makePersistent(ratingObj);
			}
			//if it has ratings, query for them and see if the user rated already or not
			//if found, update the rating, else create a new rating and add it to the comic
			else {
				Query q = mgr.newQuery(C4Rating.class);
				q.setFilter("comicId == comicIdParam");
				q.declareParameters("Long comicIdParam");
				@SuppressWarnings("unchecked")
				List<C4Rating> ratings = (List<C4Rating>) q.execute(comic.getId());
				
				boolean found = false;
				for (C4Rating r : ratings){
					if (r.getUserId().equals(userId)){
						r.setRating(rating);
						mgr.makePersistent(r);
						found = true;
					}
				}
				if (!found) {
					ratingObj = new C4Rating(userId, comicId, rating);
					mgr.makePersistent(ratingObj);	
				}	
			}
			mgr.makePersistent(comic);
			index(comic);
		} catch (NotFoundException ex) {
			throw ex;
		} finally {
			mgr.close();
		}
		updateRatings(comic);
		return comic;
	}
	
	@ApiMethod(name="addcomicpage")
	// @Named("pageId") Long pageId
	public Page addComicPage(@Named("comicId") Long comicId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Comic comic;
		Page page = new Page();
		Page pageCheck;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			
			if (comic.getPages() == null){
				List<Long> list = new ArrayList<Long>();
				comic.setPages(list);
			}
			
			//check what the page number should be. dumb.
			int pageNum = 0;
			for (Long p : comic.getPages()) {
				pageCheck = mgr.getObjectById(Page.class, p);
				if (pageCheck.getPageNumber() > pageNum)
					pageNum = pageCheck.getPageNumber();
			}
			pageNum += 1;
			page.setPageNumber(pageNum);
			//persist the page and it to the comic
			mgr.makePersistent(page);
			comic.addComicPage(page.getId());
			
			mgr.makePersistent(comic);
			index(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return page;
	}
	
	@ApiMethod(name="deletecomicpage")
	public Comic deleteComicPage(@Named("comicId") Long comicId, @Named("pageId") Long pageId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Comic comic;
		Page delPage;
		Page pageCheck;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			
			delPage = mgr.getObjectById(Page.class, pageId);
			int delNum = delPage.getPageNumber();
			
			for (Long id : comic.getPages()) {
				pageCheck = mgr.getObjectById(Page.class, id);
				if (pageCheck.getPageNumber() > delNum){
					pageCheck.setPageNumber(pageCheck.getPageNumber()-1);
					mgr.makePersistent(pageCheck);
				}
			}
			
			comic.deleteComicPage(pageId);
			mgr.makePersistent(comic);
			mgr.deletePersistent(delPage);
			index(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return comic;
	}
	
	@ApiMethod(name="addComicTag")
	public Tag addComicTag(@Named("tag") String tagName, @Named("comicId") Long comicId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		String capTag = capitalizeTag(tagName);
		Tag tag = buildTag(capTag);
		
		Comic comic;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			
			if (comic.getTags() == null){
				List<Long> list = new ArrayList<Long>();
				comic.setTags(list);
			}
			if (tag.getComicsWithTag() == null){
				List<Long> list = new ArrayList<Long>();
				tag.setComicsWithTag(list);
			}
			
			if (!comic.getTags().contains(tag.getId())){
				comic.addComicTag(tag.getId());
				tag.addTaggedComic(comicId);
			}
			
			mgr.makePersistent(comic);
			mgr.makePersistent(tag);
			
			index(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return tag;
	}
	
	@ApiMethod(name="deleteComicTag")
	public Comic deleteComicTag(@Named("comicId") Long comicId, @Named("tagId") Long tagId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		Comic comic;
		Tag tag;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			tag = mgr.getObjectById(Tag.class, tagId);
			
			comic.deleteComicTag(tagId);
			tag.deleteTaggedComic(comicId);
			
			mgr.makePersistent(comic);
			mgr.makePersistent(tag);
			
			index(comic);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id invalid.");
		} finally {
			mgr.close();
		}
		
		return comic;
	}
	
	@ApiMethod(name="addComicComment")
	public Comic addComicComment(@Named("userId") String userId, @Named("comicId") Long comicId, @Named("comment") String comment)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		Comic comic;
		Comment newComment = buildComment(userId, comment);
				
		try {
			user = mgr.getObjectById(C4User.class, userId);
			comic = mgr.getObjectById(Comic.class, comicId);
			
			if (comic.getComments() == null){
				List<Long> list = new ArrayList<Long>();
				comic.setComments(list);
			}
			if (user.getComments() == null){
				List<Long> list = new ArrayList<Long>();
				user.setComments(list);
			}
			
			comic.addComicComment(newComment.getId());
			user.addUserComment(newComment.getId());
			
			mgr.makePersistent(comic);
			mgr.makePersistent(user);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id or User Id invalid.");
		} finally {
			mgr.close();
		}
		
		return comic;
	}
	
	@ApiMethod(name="deleteComicComment")
	public Comic deleteComicComment(@Named("userId") String userId, @Named("comicId") Long comicId, @Named("commentId") Long commentId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		Comic comic;
		Comment comment;
		
		try {
			comic = mgr.getObjectById(Comic.class, comicId);
			comic.deleteComicComment(commentId);
			mgr.makePersistent(comic);
			
			user = mgr.getObjectById(C4User.class, userId);
			user.deleteUserComment(commentId);
			mgr.makePersistent(user);
			
			comment = mgr.getObjectById(Comment.class, commentId);
			mgr.deletePersistent(comment);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Comic Id or User Id invalid.");
		} finally {
			mgr.close();
		}
		
		return comic;
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
	
	private String formatDate(Date date){
		SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy");
		return formatter.format(date);
	}
	
	private String formatCommentDate(Date date){
		SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy hh:mm:ss");
		return formatter.format(date);
	}
	
	public static void index(Comic comic) throws NotFoundException{		
		PersistenceManager mgr = getPersistenceManager();
		C4User user;	
		Series series = null;
		
		try{
			user = mgr.getObjectById(C4User.class, comic.getAuthorId());				
			series = mgr.getObjectById(Series.class, comic.getSeriesId());
		} catch (javax.jdo.JDOObjectNotFoundException e){
			throw new NotFoundException("Series does not exist");
		} finally {
			mgr.close();
		}
		
		
		Document doc = Document.newBuilder()
				.setId(comic.getId().toString())
				.addField(Field.newBuilder().setName("id").setText(comic.getId().toString()))
				.addField(Field.newBuilder().setName("title").setText(comic.getTitle()))
				.addField(Field.newBuilder().setName("series").setText(series.getTitle()))
				.addField(Field.newBuilder().setName("author").setText(user.getUsername()))
				.addField(Field.newBuilder().setName("tags").setText(IndexService.buildTagString(comic.getTags())))
				.build();
		IndexService.indexDocument(IndexService.COMIC, doc);
	}
	
	private Comment buildComment(String userId, String comment) throws NotFoundException{
		PersistenceManager mgr = getPersistenceManager();

		try {
			Comment newComment = new Comment();
			String username = mgr.getObjectById(C4User.class, userId).getUsername();
			newComment.setUserId(userId);
			newComment.setUsername(username);
			newComment.setComment(comment);
			Date now = Calendar.getInstance().getTime();
			newComment.setDate(now);
			newComment.setDateString(formatCommentDate(now));
			mgr.makePersistent(newComment);
			return newComment;
		} catch (javax.jdo.JDOObjectNotFoundException e) {
			throw new NotFoundException("User ID doesn't exist");
		} finally {
			mgr.close();
		}
	}
	
	private Tag buildTag(String tagName){
		Tag returnTag;
		PersistenceManager mgr = getPersistenceManager();
		
		Query q = mgr.newQuery(Tag.class);
		q.setFilter("name == nameParam");
		q.declareParameters("String nameParam");
		
		@SuppressWarnings("unchecked")
		List<Tag> tagResults = (List<Tag>) q.execute(tagName);
		if (!tagResults.isEmpty()){
			returnTag = tagResults.get(0);
		}
		else {
			returnTag = new Tag();
			returnTag.setName(tagName);
			mgr.makePersistent(returnTag);
		}
		
		mgr.close();
		return returnTag;
	}
	
	private String capitalizeTag(String tag) {
	    if (tag == null || tag.length() == 0) {
	        return tag;
	    }
	    return tag.substring(0, 1).toUpperCase() + tag.substring(1);
	}
	
	private void updateRatings(Comic comic) {
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		Series series;
		Comic  comics;
		int count = 0;
		double total = 0;
		double avg;
		
		//comic rating
		Query q = mgr.newQuery(C4Rating.class);
		q.setFilter("comicId == comicIdParam");
		q.declareParameters("Long comicIdParam");
		@SuppressWarnings("unchecked")
		List<C4Rating> ratings = (List<C4Rating>) q.execute(comic.getId());
		
		for (C4Rating r : ratings) {
			count += 1;
			total += r.getRating();
		}
		if (count != 0)
			avg = total/count;
		else
			avg = 0.0;
		comic.setRating(avg);
		mgr.makePersistent(comic);
		
		//series rating
		count = 0;
		total = 0;
		series = mgr.getObjectById(Series.class, comic.getSeriesId());
		for (Long id : series.getComics()) {
			comics = mgr.getObjectById(Comic.class, id);
			if (comics.isRated()) {
				count += 1;
				total += comics.getRating();
			}		
		}
		if (count != 0) {
			avg = total/count;
			series.setRated(true);
		}
		else
			avg = 0.0;
		series.setRating(avg);
		mgr.makePersistent(series);
		
		//user rating
		count = 0;
		total = 0;
		user = mgr.getObjectById(C4User.class, comic.getAuthorId());
		for (Long id : user.getUserSeries()) {
			series = mgr.getObjectById(Series.class, id);
			if (series.isRated()){
				count += 1;
				total += series.getRating();
			}
		}
		if (count != 0)
			avg = total/count;
		else
			avg = 0.0;
		user.setRating(avg);
		mgr.makePersistent(user);
			
		mgr.close();
	}
	
}
