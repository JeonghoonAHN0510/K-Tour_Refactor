package ktour.util.file;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * 파일과 관련된 Util 클래스
 * <p>
 * 업로드, 삭제 등의 기능 수행
 * @author AhnJH
 */

@Component
@Log4j2
public class FileUtil {
    // 업로드 기본 경로
    private String baseDir = System.getProperty("user.dir");
    private String uploadPath = baseDir + "/src/main/ktour/public/uploads/";

    /**
     * [업로드 파일, 카테고리 타입]을 받아서, 파일을 업로드한다.
     *
     * @param multipartFile 업로드된 파일
     * @param columnName    업로드된 파일의 컬럼명 ex) ppImg, siLogo, siFavicon ···
     * @param siNo          업로드한 사이트의 PK ex) 1, 2 ···
     * @return 생성된 파일명
     * @author AhnJH
     */
    public String uploadFile(MultipartFile multipartFile, String columnName, String siNo){
        // 1. 중복 이미지명 제거를 위한 UUID 생성
        String uuid = UUID.randomUUID().toString();
        // 2. UUID를 기반으로 한 파일명 생성
        String fileName = uuid + "_" + multipartFile.getOriginalFilename().replaceAll("_", "-");
        // 3. 업로드할 파일 경로 생성
        String uploadFolderPath = uploadPath + siNo + "/" + columnName + "/";
        // 4. 파일경로 File 객체 생성
        File filepath = new File(uploadFolderPath);
        // 5. 파일경로 존재여부 확인 | 존재하지 않으면, 폴더 생성
        if (!filepath.exists()){
            filepath.mkdirs();
        } // if end
        // 6. 업로드할 파일의 File 객체 생성
        File finalFilePath = new File(uploadFolderPath + fileName);
        // 7. File 객체를 통한 업로드 진행
        try {
            multipartFile.transferTo(finalFilePath);
        } catch (IOException e) {
            log.error("파일 업로드 중 오류 발생\n" + e);
        } // try-catch end
        // 8. 최종적으로 UUID가 포함된 파일명 반환
        return fileName;
    } // func end

    /**
     * [카테고리 타입, 삭제할 파일명]을 받아서, 해당하는 파일을 삭제한다.
     *
     * @param fileName 삭제할 파일명
     * @param columnName    업로드된 파일의 컬럼명 ex) ppImg, siLogo, siFavicon ···
     * @param siNo          업로드한 사이트의 PK ex) 1, 2 ···
     * @return 파일삭제 성공여부
     * @author AhnJH
     */
    public boolean deleteFile(String fileName, String columnName, String siNo){
        // 1. 삭제할 파일명과 경로 생성
        String deleteFilePath = uploadPath + siNo + "/" + columnName + "/" + fileName;
        // 2. 경로에 대한 File 객체 생성
        File deleteFile = new File(deleteFilePath);
        // 3. 삭제 진행
        if (deleteFile.exists()){
            // 3-1. 경로에 파일이 존재하면, 삭제 및 true 반환
            deleteFile.delete();
            return true;
        } else {
            // 3-2. 존재하지 않으면, false 반환
            return false;
        } // if end
    } // func end
} // class end