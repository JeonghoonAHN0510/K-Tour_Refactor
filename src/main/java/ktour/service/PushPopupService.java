package ktour.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ktour.model.dto.PushPopupDto;
import ktour.model.mapper.PushPopupMapper;
import ktour.util.file.FileUtil;
import ktour.util.pagenation.Page;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PushPopupService {

    private final PushPopupMapper pushPopupMapper;
    private final FileUtil fileUtil;

    /**
     * 4. 수정
     *
     * @author juju9595
     */
    //1. 검색
    public Page<PushPopupDto> searchPush( String ppUse, String ppType, String ppTitle, String status, int page, int pageSize){
    List<PushPopupDto> searchPush = pushPopupMapper.searchPush( ppUse, ppType, ppTitle, status);
        return new Page<>(
                searchPush,
                searchPush.size(),
                page, pageSize

        );
    }


    //2. 등록
    @Transactional // 등록과 이미지 등록이 모두 성공이면.. 트랜잭션
    public int addPush(PushPopupDto pushPopupDto) {
        pushPopupMapper.addPush(pushPopupDto);
        if(pushPopupDto.getPpNo() > 0){
            if(pushPopupDto.getFile() != null && !pushPopupDto.getFile().isEmpty()){// 가져온 파일이 null 아니고 비어있지 않으면 유효성 검사
            String upload = uploadFile( pushPopupDto.getFile() , "ppImg"  );
            if( upload != null ) pushPopupDto.setPpImg( upload ); // 업로드 성공이면 업로드할 이미지명 변경
            pushPopupMapper.updatePushImg( pushPopupDto );}
            return pushPopupDto.getPpNo();
        }else{
            return 0;
        }
    }

    //3. 삭제
    public boolean deletePush(int ppNo){
        return pushPopupMapper.deletePush(ppNo) > 0;
    }

    //4. 수정
    public boolean updatePush(PushPopupDto dto){
        if(dto.getPpNo() == 0) return false; // 키 누락 방지
        // 만약에 수정시 새로운 첨부파일이 없으면 기존 파일 사용
        int result = pushPopupMapper.updatePush(dto);

        if(dto.getFile() != null&&!dto.getFile().isEmpty()){// 새로운 첨부파일이 있으면
            String upload = uploadFile(dto.getFile(), "ppImg");
            if(upload != null){
                pushPopupMapper.updatePpImg(dto.getPpNo(), upload);
            }
        }
        return result > 0;
    }

    //5. 파일 등록
    private String uploadFile(MultipartFile multipartFile, String ppImg){
        if( multipartFile == null || multipartFile.isEmpty()) return null;
        try{
            return fileUtil.uploadFile(multipartFile, "ppImg", "1");
        } catch (Exception e) {
            return null;
        }
    }

    //6.
    public String findByPlaceNo(String pNo) {
        return pushPopupMapper.findByPlaceNo(pNo);
    }

    //7. 배너 출력
    public List<PushPopupDto> bannerPush(){
        return pushPopupMapper.bannerPush();
    }

}
