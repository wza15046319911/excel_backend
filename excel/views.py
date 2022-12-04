from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpRequest, JsonResponse


# Create your views here.
@csrf_exempt
def upload_file(request: HttpRequest):
    return JsonResponse({'status': 'ok'})
    # if request.method == 'POST':
    #     file = request.FILES['file']
    #     print(file, type(file))
    #     df = pd.read_excel(file)
    #     # get columns
    #     columns = df.columns
    #     # calculate total money
    #     total_money = df['money'].sum()
    #     if total_money != 55:
    #         return JsonResponse({'error': 'total money is not 55', 'columns': columns.tolist(),
    #                              'values': df.values.tolist()})
    #     return JsonResponse(
    #         {
    #             'error': "",
    #             'columns': columns.tolist(),
    #             'values': df.values.tolist()
    #         }
    #     )
